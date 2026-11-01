/* ===========================================================================
   THE DANK 100 - BUILDING THE WEEKLY CHART (Cloudflare Pages Function)
   ===========================================================================
   Step 3 of DANK100-PLAN.md. Adds every listener's entry for a week up into
   The Dank 100 (songs), Dank 100 Artists and Dank 100 Albums, and saves the
   result where everyone can read it.

   Routes (this file answers /dank100/*):
     GET /dank100/chart?week=2026-10-30   the chart for a closed week; built on
                                          the spot by the first visitor after
                                          the week closes, then just read
     GET /dank100/chart                   the latest closed week
     GET /dank100/count?week=…            how many entries a week has so far
                                          (a number only, never whose)

   Why a server piece: if a browser added the chart up and saved it, anyone
   could save a fake one. Entries are private (firestore.rules), so only this
   function, holding the service account, can read them all.

   Secrets (Cloudflare → Workers & Pages → dankcharts → Settings → Variables
   and Secrets, both encrypted):
     FB_SA_EMAIL   client_email from the service-account JSON
     FB_SA_KEY     private_key from it; the literal "\n"s are turned back into
                   line breaks below, so it can be pasted as one line
   Cloudflare Functions aren't Node, so there is no firebase-admin: the
   function signs its own Google OAuth token (RS256 JWT, WebCrypto) and talks
   to the Firestore REST API. The same helper is meant for the admin page
   (ADMIN-PLAN.md step 1).

   Firestore (the service account skips the rules):
     dank100Entries/{week}_{uid}   read      the entries (dank100.js writes them)
     dank100Excluded/{uid}         read      accounts kept out of the count
     dank100Charts/{week}          write     the public chart (rules: anyone may get)
     dank100History/{week}         write     private running record of every key
                                             that ever charted (peak, weeks on),
                                             so next week can tell NEW from RE

   Scoring: in each entry, row n scores 101 - rank, where rank counts the rows
   with strictly more plays (so tied plays score the same). A key's total is
   the sum over entries; ties go to more listeners, then more plays.
   =========================================================================== */

const PROJECT = 'dankcharts';
const FS = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;
const TYPES = ['songs', 'artists', 'albums'];
const MAX_ROWS = 100;          // per list, in an entry and in the chart (dank100.js MAX_ROWS)
const MIN_ENTRIES = 3;         // fewer entries than this: no chart, just the count
const MAX_TEXT = 200;          // longest title / name kept (dank100.js MAX_TEXT)
const LOCK_STALE_MS = 3 * 60000; // a build that hasn't finished in 3 min is taken over
// The first Dank 100 week. Earlier weeks have no entries, so a build never
// walks back past it looking for last week's chart.
const FIRST_WEEK = '2026-10-23';
const MAX_BACKFILL = 6;        // closed weeks nobody opened, built on the way

// ── The week (kept in step with dank100.js) ─────────────────────────────────
const DAY_MS = 86400000, WEEK_MS = 7 * DAY_MS, GRACE_DAYS = 3, WEEK_START_DOW = 5;
const pad2 = n => (n < 10 ? '0' : '') + n;
function weekStartOf(date) {
  const d = new Date(date);
  const back = (d.getUTCDay() - WEEK_START_DOW + 7) % 7;
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - back));
}
function weekIdOf(date) {
  const s = weekStartOf(date);
  return s.getUTCFullYear() + '-' + pad2(s.getUTCMonth() + 1) + '-' + pad2(s.getUTCDate());
}
function weekBounds(id) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(id || '');
  if (!m) return null;
  const start = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  if (start.getUTCDay() !== WEEK_START_DOW || weekIdOf(start) !== id) return null;
  return { id, start, end: new Date(+start + WEEK_MS), closes: new Date(+start + WEEK_MS + GRACE_DAYS * DAY_MS) };
}
const prevWeek = id => weekIdOf(new Date(+weekBounds(id).start - DAY_MS));
// The newest week whose sending has closed.
function latestClosedWeek(now) {
  let w = weekIdOf(now);
  while (!(now >= weekBounds(w).closes)) w = prevWeek(w);
  return w;
}

// ── Google auth: a service-account token, signed here ───────────────────────
let _token = null, _tokenExp = 0, _tokenFor = '';   // kept while the isolate lives

function b64url(bytes) {
  let s = '';
  const u = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  for (let i = 0; i < u.length; i++) s += String.fromCharCode(u[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
const b64urlText = t => b64url(new TextEncoder().encode(t));

async function importKey(pem) {
  const body = String(pem || '')
    .replace(/\\n/g, '\n')                       // pasted with literal \n
    .replace(/-----(BEGIN|END) PRIVATE KEY-----/g, '')
    .replace(/\s+/g, '');
  const der = Uint8Array.from(atob(body), c => c.charCodeAt(0));
  return crypto.subtle.importKey('pkcs8', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
}

export async function googleToken(env, scope = 'https://www.googleapis.com/auth/datastore') {
  if (!env.FB_SA_EMAIL || !env.FB_SA_KEY) throw new HttpError(500, 'not-configured');
  const now = Math.floor(Date.now() / 1000);
  if (_token && _tokenFor === env.FB_SA_EMAIL && now < _tokenExp - 120) return _token;
  const head = b64urlText(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = b64urlText(JSON.stringify({
    iss: env.FB_SA_EMAIL, scope, aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600
  }));
  const key = await importKey(env.FB_SA_KEY);
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(head + '.' + claims));
  const jwt = head + '.' + claims + '.' + b64url(sig);
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + jwt
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.access_token) throw new HttpError(502, 'auth-failed');
  _token = j.access_token; _tokenExp = now + (j.expires_in || 3600); _tokenFor = env.FB_SA_EMAIL;
  return _token;
}

class HttpError extends Error { constructor(status, code) { super(code); this.status = status; this.code = code; } }

// ── Firestore REST: values in and out ───────────────────────────────────────
export function toFs(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (v instanceof Date) return { timestampValue: v.toISOString() };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(toFs) } };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === 'object') return { mapValue: { fields: fieldsOf(v) } };
  return { stringValue: String(v) };
}
function fieldsOf(o) { const f = {}; for (const k in o) if (o[k] !== undefined) f[k] = toFs(o[k]); return f; }
export function fromFs(v) {
  if (!v) return null;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('timestampValue' in v) return v.timestampValue;
  if ('nullValue' in v) return null;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(fromFs);
  if ('mapValue' in v) return docData(v.mapValue);
  return null;
}
function docData(doc) { const o = {}; const f = (doc && doc.fields) || {}; for (const k in f) o[k] = fromFs(f[k]); return o; }

function fsClient(token) {
  const call = async (method, path, body) => {
    const r = await fetch(FS + path, {
      method,
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });
    if (r.status === 404) return { status: 404, json: null };
    const json = await r.json().catch(() => null);
    return { status: r.status, json };
  };
  return {
    // One document, or null.
    async get(col, id) {
      const r = await call('GET', `/${col}/${encodeURIComponent(id)}`);
      if (r.status === 404) return null;
      if (r.status !== 200) throw new HttpError(502, 'firestore-read');
      return { data: docData(r.json), updateTime: r.json.updateTime };
    },
    // Create only if missing; false when it already exists.
    async create(col, id, data) {
      const r = await call('POST', `/${col}?documentId=${encodeURIComponent(id)}`, { fields: fieldsOf(data) });
      if (r.status === 409) return false;
      if (r.status !== 200) throw new HttpError(502, 'firestore-write');
      return true;
    },
    // Replace a document; with `ifUpdateTime`, only if nobody wrote it since.
    async set(col, id, data, ifUpdateTime) {
      const q = ifUpdateTime ? `?currentDocument.updateTime=${encodeURIComponent(ifUpdateTime)}` : '';
      const r = await call('PATCH', `/${col}/${encodeURIComponent(id)}${q}`, { fields: fieldsOf(data) });
      if (ifUpdateTime && (r.status === 400 || r.status === 409 || r.status === 412)) return false;
      if (r.status !== 200) throw new HttpError(502, 'firestore-write');
      return true;
    },
    // Every document in a collection where field == value; `only` limits
    // which fields come back (e.g. just a count needs one small field).
    async where(col, field, value, only) {
      const q = {
        from: [{ collectionId: col }],
        where: { fieldFilter: { field: { fieldPath: field }, op: 'EQUAL', value: toFs(value) } }
      };
      if (only) q.select = { fields: only.map(f => ({ fieldPath: f })) };
      const r = await call('POST', ':runQuery', { structuredQuery: q });
      if (r.status !== 200 || !Array.isArray(r.json)) throw new HttpError(502, 'firestore-query');
      return r.json.filter(x => x.document).map(x => ({ id: x.document.name.split('/').pop(), data: docData(x.document) }));
    },
    // Ids in a (small) collection.
    async ids(col) {
      const out = []; let page = '';
      do {
        const r = await call('GET', `/${col}?pageSize=300${page ? '&pageToken=' + encodeURIComponent(page) : ''}`);
        if (r.status === 404) break;
        if (r.status !== 200) throw new HttpError(502, 'firestore-read');
        (r.json.documents || []).forEach(d => out.push(d.name.split('/').pop()));
        page = r.json.nextPageToken || '';
      } while (page);
      return out;
    }
  };
}

// ── Counting ────────────────────────────────────────────────────────────────
const clip = s => { s = String(s == null ? '' : s); return s.length > MAX_TEXT ? s.slice(0, MAX_TEXT) : s; };

// One entry's list → [{ k, t, a, n, pts }], cleaned. Rows are re-ranked by
// their play counts here rather than trusting the order they came in.
export function scoreList(rows) {
  if (!Array.isArray(rows)) return [];
  const seen = new Set();
  const clean = [];
  for (const r of rows.slice(0, MAX_ROWS)) {
    if (!r || typeof r.k !== 'string' || !r.k || r.k.length > 2 * MAX_TEXT + 1 || seen.has(r.k)) continue;
    const n = Math.max(0, Math.floor(Number(r.n) || 0));
    if (!n) continue;
    seen.add(r.k);
    clean.push({ k: r.k, t: clip(r.t), a: clip(r.a), n });
  }
  clean.sort((x, y) => y.n - x.n);
  // Competition ranking: rank = 1 + rows with strictly more plays.
  let rank = 0;
  clean.forEach((r, i) => {
    if (i === 0 || r.n < clean[i - 1].n) rank = i + 1;
    r.pts = 101 - rank;
  });
  return clean;
}

// All entries → the three ranked charts (no history yet).
export function tally(entries) {
  const out = {};
  for (const type of TYPES) {
    const m = new Map();
    for (const e of entries) {
      for (const r of scoreList(e[type])) {
        let x = m.get(r.k);
        if (!x) m.set(r.k, x = { k: r.k, pts: 0, l: 0, pl: 0, spell: new Map() });
        x.pts += r.pts; x.l += 1; x.pl += r.n;
        const sp = r.t + '\u0000' + r.a;
        x.spell.set(sp, (x.spell.get(sp) || 0) + 1);
      }
    }
    const rows = [...m.values()].sort((a, b) =>
      (b.pts - a.pts) || (b.l - a.l) || (b.pl - a.pl) || (a.k < b.k ? -1 : a.k > b.k ? 1 : 0));
    out[type] = rows.slice(0, MAX_ROWS).map((x, i) => {
      // The spelling most entries used
      let best = '', bn = -1;
      for (const [sp, c] of x.spell) if (c > bn) { best = sp; bn = c; }
      const [t, a] = best.split('\u0000');
      const row = { p: i + 1, k: x.k, t, pts: x.pts, l: x.l, pl: x.pl };
      if (type !== 'artists') row.a = a;
      return row;
    });
  }
  return out;
}

// Adds last week (lw), peak (pk), weeks on chart (wk) and NEW / RE marks
// from the running history, and returns the history moved on a week.
export function withHistory(charts, prevChart, history) {
  const hist = {};
  for (const type of TYPES) hist[type] = Object.assign({}, (history && history[type]) || {});
  const prevPos = {};
  for (const type of TYPES) {
    prevPos[type] = {};
    ((prevChart && prevChart[type]) || []).forEach(r => { prevPos[type][r.k] = r.p; });
  }
  for (const type of TYPES) {
    for (const r of charts[type]) {
      const h = hist[type][r.k];
      const lw = prevPos[type][r.k] || null;
      r.lw = lw;
      r.st = lw ? '' : (h ? 're' : 'new');
      const pk = h ? Math.min(h.pk, r.p) : r.p;
      const wk = (h ? h.wk : 0) + 1;
      r.pk = pk; r.wk = wk;
      hist[type][r.k] = { pk, wk };
    }
  }
  return hist;
}

// ── Building one week ───────────────────────────────────────────────────────
async function buildWeek(db, week, depth) {
  // Last week's chart first, so the movement arrows have something to compare
  // with. A closed week nobody opened yet is built on the way (a few at most).
  let prevChart = null, history = null;
  const pw = prevWeek(week);
  if (pw >= FIRST_WEEK) {
    let prev = await db.get('dank100Charts', pw);
    if ((!prev || prev.data.status !== 'done' && prev.data.status !== 'small') && depth < MAX_BACKFILL) {
      await ensureChart(db, pw, depth + 1);
      prev = await db.get('dank100Charts', pw);
    }
    if (prev && prev.data.status === 'done') prevChart = prev.data;
    const h = await db.get('dank100History', pw);
    if (h) history = h.data;
  }

  const excluded = new Set(await db.ids('dank100Excluded'));
  const entries = (await db.where('dank100Entries', 'week', week))
    .filter(d => d.data && d.data.uid && d.id === week + '_' + d.data.uid && !excluded.has(d.data.uid))
    .map(d => d.data);

  const base = { week, builtAt: new Date(), entries: entries.length, v: 1 };
  if (entries.length < MIN_ENTRIES) {
    // Too few to publish (and too few to keep anyone's taste private). The
    // history is carried over unchanged so the next week still knows RE.
    if (history) await db.set('dank100History', week, history);
    return Object.assign(base, { status: 'small', min: MIN_ENTRIES });
  }
  const charts = tally(entries);
  const hist = withHistory(charts, prevChart, history);
  await db.set('dank100History', week, hist);
  return Object.assign(base, { status: 'done' }, charts);
}

// The saved chart for a closed week, building it first if nobody has.
async function ensureChart(db, week, depth = 0) {
  const have = await db.get('dank100Charts', week);
  if (have && (have.data.status === 'done' || have.data.status === 'small')) return have.data;

  // Take the lock: create a 'building' doc, or take over a stale one.
  const lock = { week, status: 'building', lockedAt: new Date() };
  let mine;
  if (!have) mine = await db.create('dank100Charts', week, lock);
  // (A lock with no readable time counts as stale, so it can never stick.)
  else if (!(Date.now() - Date.parse(have.data.lockedAt) <= LOCK_STALE_MS)) mine = await db.set('dank100Charts', week, lock, have.updateTime);
  else mine = false;
  if (!mine) return { week, status: 'building' };

  try {
    const chart = await buildWeek(db, week, depth);
    await db.set('dank100Charts', week, chart);
    return chart;
  } catch (e) {
    // Leave a stale-able lock rather than a half chart; the next visitor
    // retries once LOCK_STALE_MS has passed.
    throw e;
  }
}

// ── The request ─────────────────────────────────────────────────────────────
function reply(body, status, maxAge) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': maxAge ? `public, max-age=${maxAge}` : 'no-store'
    }
  });
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const route = url.pathname.replace(/^\/dank100\/?/, '').replace(/\/$/, '');
  const now = new Date();
  try {
    if (route === 'chart') {
      const week = url.searchParams.get('week') || latestClosedWeek(now);
      const b = weekBounds(week);
      if (!b) return reply({ error: 'bad-week' }, 400);
      if (week < FIRST_WEEK) return reply({ week, status: 'none' }, 200, 3600);
      if (now < b.closes) return reply({ week, status: 'open', closes: b.closes.toISOString() }, 200, 60);
      const db = fsClient(await googleToken(context.env));
      const chart = await ensureChart(db, week);
      // A finished chart never changes, so the edge may keep it a while.
      return reply(chart, 200, chart.status === 'building' ? 0 : 600);
    }
    if (route === 'count') {
      const week = url.searchParams.get('week') || weekIdOf(now);
      if (!weekBounds(week)) return reply({ error: 'bad-week' }, 400);
      const db = fsClient(await googleToken(context.env));
      const n = (await db.where('dank100Entries', 'week', week, ['uid'])).length;
      return reply({ week, entries: n }, 200, 120);
    }
    return reply({ error: 'not-found' }, 404);
  } catch (e) {
    console.error('dank100', e && (e.code || e.message));
    return reply({ error: (e && e.code) || 'failed' }, (e && e.status) || 500);
  }
}
