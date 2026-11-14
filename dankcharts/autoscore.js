/* ===========================================================================
   LISTENING SCORES — dankcharts.fm (AUTO-SCORE-PLAN.md, 2026-11-14)
   ===========================================================================
   An automatic 0–10 score for every song, album, EP and single, worked out
   from how you listen to it and what it did on your charts. ON by default
   (Settings → Releases → Listening Scores).

   It is a PLACEHOLDER, not a second rating:
     - Your own score (the critic rubric in app.js) always wins.
     - A song you haven't rated shows its Listening Score instead.
     - An album mixes the two one track at a time: rated tracks use your
       score, unrated ones their song Listening Score, so the album is
       "mixed" until every track is yours. The aspects half (cohesion, art…)
       is never filled in by the system.
     - A release with nothing of yours rated at all shows the release's own
       Listening Score.
   Nothing here is ever written into dc_ratings. Records, Awards, smart
   playlists and the artist verdict only count Listening Scores when the
   "Count Listening Scores where I haven't rated" switch is on (off by
   default) — they go through ratingSongScoreCounted / ratingAlbumScoreCounted.

   How a score is made: each item gets up to six signals (AS_SIGNALS). Each
   signal becomes a rank inside the user's own library (0 = lowest, 1 =
   highest), compared only with items of the same kind (songs / albums /
   singles + EPs). The weighted average of those ranks is ranked once more
   and spread over 3.0–10.0 (AS_CURVE), so every library — light or heavy listener —
   gets a full range of verdicts.

   Works for Last.fm, Google Sheets and file uploads alike: it only reads
   allPlays and what is built from it (chart runs, certifications).

   Prefix: as. Settings live in _ratings.cfg.auto (synced with the ratings
   doc, same as the track weight).
   =========================================================================== */

const AS_DAY_MS = 86400000;
const AS_MIN_PLAYS = 5;        // fewer plays than this → no score ("not enough listening yet")
const AS_EARLY_DAYS = 90;      // first played less than this long ago → "Early"
/* Where a rank in your library (0 = lowest, 1 = highest) lands on the 0–10
   scale. Straight lines between these points, so roughly: the top 10% are
   Masterpieces (9+), the next 15% Essential, 20% Great, 20% Good, 20% Mixed
   and the bottom 15% Weak (3.0–5.0). Nothing you play 5+ times is "Poor". */
const AS_CURVE = [[0, 3.0], [0.15, 5.0], [0.35, 6.0], [0.55, 7.0], [0.75, 8.0], [0.90, 9.0], [1, 10.0]];
function _asScoreOfRank(q) {
  for (let i = 1; i < AS_CURVE.length; i++) {
    const [q1, s1] = AS_CURVE[i];
    if (q <= q1) {
      const [q0, s0] = AS_CURVE[i - 1];
      return s0 + (s1 - s0) * (q - q0) / (q1 - q0);
    }
  }
  return 10;
}

// The six signals, in the order the "Why this score" breakdown lists them.
// Weights are the defaults; Settings can change each one (0–40).
const AS_SIGNALS = ['depth', 'cover', 'stay', 'peak', 'life', 'honours'];
const AS_DEFAULT_W = { depth: 20, cover: 15, stay: 25, peak: 15, life: 10, honours: 15 };

// ─── SETTINGS ─────────────────────────────────────────────────────────────

// The stored settings object, created on first use. Lives inside the ratings
// config so it syncs with the rest of the ratings doc.
function asCfg() {
  // On by default (user, 2026-11-14): only an explicit "off" is stored as false
  if (typeof _ratings === 'undefined') return { on: true, count: false, w: {} };
  const c = _ratings.cfg.auto;
  if (c && typeof c === 'object') return c;
  return (_ratings.cfg.auto = { on: true, count: false, w: {} });
}
function asOn()     { return asCfg().on !== false; }
function asCounts() { return asOn() && !!asCfg().count; }

// One signal's weight, falling back to the default when unset or bad
function asWeight(id) {
  const v = asCfg().w ? asCfg().w[id] : undefined;
  return (typeof v === 'number' && v >= 0 && v <= 40) ? v : AS_DEFAULT_W[id];
}

// Saves a settings change: stamp the config (so it wins the sync merge),
// save, drop every cached score, repaint
function _asSaveCfg() {
  _ratings.cfgTs = Date.now();
  asInvalidate();
  ratingsPersist(true);
  asSyncSettingsUI();
  if (typeof ratingsRefreshUI === 'function') ratingsRefreshUI();
  _asRepaintOpenPages();
}
function asSetOn(on)    { asCfg().on = !!on; _asSaveCfg(); }
function asSetCount(on) { asCfg().count = !!on; _asSaveCfg(); }
function asSetWeight(id, v) {
  if (!AS_SIGNALS.includes(id)) return;
  const c = asCfg();
  c.w = Object.assign({}, c.w, { [id]: Math.max(0, Math.min(40, Math.round(+v || 0))) });
  // A drag fires many inputs: save once it settles, but show the new numbers now
  asInvalidate();
  _asRenderSettingsPreview();
  clearTimeout(_asWeightTimer);
  _asWeightTimer = setTimeout(_asSaveCfg, 500);
}
let _asWeightTimer = null;
function asResetWeights() { asCfg().w = {}; _asSaveCfg(); }

// Repaints the album / song / artist pages that are open behind Settings, so
// a switch flip shows straight away
function _asRepaintOpenPages() {
  try {
    if (typeof _currentAlbumKey !== 'undefined' && _currentAlbumKey && document.getElementById('albumModal')?.classList.contains('open')) renderAlbumRatingSection(_currentAlbumKey);
    if (typeof _currentSongKey !== 'undefined' && _currentSongKey && document.getElementById('songModal')?.classList.contains('open')) renderSongRatingSection(_currentSongKey);
    if (typeof _ratingArtistOpen !== 'undefined' && _ratingArtistOpen && document.getElementById('modalArtistRating')) renderArtistRatingSection(_ratingArtistOpen);
  } catch (e) { /* a page that is not open has nothing to repaint */ }
}

// ─── THE FACTS ────────────────────────────────────────────────────────────
/* Built once per data load, in two walks of allPlays (the first finds each
   item's first play, the second counts what came after it), plus the weekly
   chart run the site already keeps. Rebuilt when anything below changes:
   the plays, the release marks, the chart sizes, the weights, the
   certification thresholds or a newly fetched tracklist. */

let _asCache = null;    // { gen, songs: Map, rels: Map }
let _asTlVer = 0;       // bumped when a tracklist arrives (asOnTracklist)

function _asGen() {
  const cg = (typeof _crGeneration === 'function') ? _crGeneration() : '';
  const w = AS_SIGNALS.map(asWeight).join(',');
  const c = (typeof CERT !== 'undefined') ? JSON.stringify(CERT) : '';
  return cg + '|' + (allPlays ? allPlays.length : 0) + '|' + w + '|' + c + '|' + _asTlVer;
}

// Throws away every score; the next lookup rebuilds
function asInvalidate() {
  _asCache = null;
  if (typeof ratingMemoInvalidate === 'function') ratingMemoInvalidate();
}

// Called by app.js when Deezer gives us an album's tracklist, which changes
// that album's coverage. Debounced: a batch of lookups rebuilds once.
let _asTlTimer = null;
function asOnTracklist() {
  clearTimeout(_asTlTimer);
  _asTlTimer = setTimeout(() => { _asTlVer++; asInvalidate(); _asRepaintOpenPages(); }, 800);
}

// A title made comparable: lower case, no "(feat. …)" / "[Remastered]" / " - Live",
// letters and digits only. Used to match a Deezer tracklist to played songs.
function _asNormTitle(s) {
  return String(s || '').toLowerCase()
    .replace(/\s*[([].*?[)\]]/g, '')
    .replace(/\s+-\s+.*$/, '')
    .replace(/[^a-z0-9À-ɏ]+/g, '');
}

// Certification "weight": none 0, gold 1, platinum 2, diamond 2 + its multiple
function _asCertWeight(n, cfg) {
  if (!cfg) return 0;
  if (n >= cfg.diamond) return 2 + Math.floor(n / cfg.diamond);
  if (n >= cfg.plat) return 2;
  if (n >= cfg.gold) return 1;
  return 0;
}

// Per item: { peak, wks, at1 } from the weekly chart run, or an empty map when
// the run can't be built (no data yet)
function _asChartTable(type) {
  try {
    const run = _crFull('week');
    return (run && run.result && run.result[type]) || {};
  } catch (e) { return {}; }
}

function _asBuild() {
  const gen = _asGen();
  if (_asCache && _asCache.gen === gen) return _asCache;

  const plays = allPlays || [];
  const now = Date.now();
  const songs = new Map();   // songKey → raw facts
  const rels = new Map();    // albumKey → raw facts
  const roll = (typeof rollupAffectsModal === 'function') && rollupAffectsModal();

  // Walk 1: plays, first / last play, months, an album's tracks
  for (let i = 0; i < plays.length; i++) {
    const p = plays[i];
    const t = +p.date;
    const mo = dayStrOf(p).slice(0, 7);
    const sk = songKey(p);
    let s = songs.get(sk);
    if (!s) songs.set(sk, s = { plays: 0, first: t, last: t, months: new Set(), late6: false, late12: false });
    s.plays++;
    if (t < s.first) s.first = t;
    if (t > s.last) s.last = t;
    s.months.add(mo);

    if (!p.album || p.album === '—') continue;
    const ak = albumKeyOf(p);
    let r = rels.get(ak);
    if (!r) rels.set(ak, r = { plays: 0, certPlays: 0, first: t, last: t, months: new Set(), late6: false, late12: false, tracks: new Map() });
    r.plays++; r.certPlays++;
    if (t < r.first) r.first = t;
    if (t > r.last) r.last = t;
    r.months.add(mo);
    const tr = r.tracks.get(sk);
    if (tr) tr.n++; else r.tracks.set(sk, { n: 1, title: p.title });
    // A single's plays also count toward its album's certification when the
    // roll-up setting says so — the same total the album page shows
    if (roll) {
      const par = rollupParentOf(p, true);
      if (par && par !== ak) {
        let pr = rels.get(par);
        if (!pr) rels.set(par, pr = { plays: 0, certPlays: 0, first: t, last: t, months: new Set(), late6: false, late12: false, tracks: new Map() });
        pr.certPlays++;
      }
    }
  }

  // Walk 2: still played half a year / a year after the first play?
  for (let i = 0; i < plays.length; i++) {
    const p = plays[i];
    const t = +p.date;
    const s = songs.get(songKey(p));
    if (t - s.first >= 182 * AS_DAY_MS) s.late6 = true;
    if (t - s.first >= 365 * AS_DAY_MS) s.late12 = true;
    if (!p.album || p.album === '—') continue;
    const r = rels.get(albumKeyOf(p));
    if (t - r.first >= 182 * AS_DAY_MS) r.late6 = true;
    if (t - r.first >= 365 * AS_DAY_MS) r.late12 = true;
  }

  // Chart facts from the weekly chart run
  const chartOf = tbl => {
    const out = new Map();
    for (const k in tbl) {
      const E = tbl[k].entries || [];
      if (!E.length) continue;
      let at1 = 0;
      for (const e of E) if (e.rank === 1) at1++;
      out.set(k, { peak: tbl[k].peak, wks: E.length, at1 });
    }
    return out;
  };
  const songCh = chartOf(_asChartTable('songs'));
  const relCh = chartOf(_asChartTable('albums'));
  const tlStore = (typeof _rtTracklistStore === 'function') ? _rtTracklistStore() : {};
  const songCert = (typeof CERT !== 'undefined') ? CERT.song : null;

  // Turn raw facts into signal values. null = the signal doesn't apply.
  const staying = f => f.months.size + (f.late6 ? 2 : 0) + (f.late12 ? 3 : 0);
  const items = { song: [], album: [], single: [] };   // the three ranking pools

  for (const [k, s] of songs) {
    if (s.plays < AS_MIN_PLAYS) continue;
    const ch = songCh.get(k);
    const early = now - s.first < AS_EARLY_DAYS * AS_DAY_MS;
    items.song.push({
      key: k, kind: 'song', early, plays: s.plays,
      v: {
        depth: s.plays,
        cover: null,
        stay: early ? null : staying(s),
        peak: ch ? -ch.peak : -1e9,                 // lower peak = better; never charted = bottom
        life: ch ? ch.wks + 2 * ch.at1 : 0,
        honours: _asCertWeight(s.plays, songCert)
      },
      raw: { plays: s.plays, months: s.months.size, late6: s.late6, late12: s.late12, peak: ch ? ch.peak : null, wks: ch ? ch.wks : 0, at1: ch ? ch.at1 : 0, cert: _asCertWeight(s.plays, songCert) }
    });
  }

  for (const [k, r] of rels) {
    if (r.plays < AS_MIN_PLAYS) continue;
    const kind = (typeof ratingReleaseKind === 'function') ? ratingReleaseKind(k).kind : 'album';
    const pool = kind === 'album' ? 'album' : 'single';
    const [album, artist = ''] = k.split('|||');
    const ch = relCh.get(k);
    const early = now - r.first < AS_EARLY_DAYS * AS_DAY_MS;

    // Tracklist: Deezer's when we have it, else the songs you've played
    const tl = Array.isArray(tlStore[k]) && tlStore[k].length ? tlStore[k] : null;
    const nTracks = tl ? tl.length : r.tracks.size;
    let covered = null;
    if (tl && pool === 'album') {
      // Tracks of the official list you've played at least twice
      const playedTwice = new Set();
      for (const tr of r.tracks.values()) if (tr.n >= 2) playedTwice.add(_asNormTitle(tr.title));
      covered = 0;
      for (const title of tl) if (playedTwice.has(_asNormTitle(title))) covered++;
    }
    const certCfg = (typeof certCfgFor === 'function') ? certCfgFor(album, artist) : null;
    const cert = _asCertWeight(r.certPlays, certCfg);
    items[pool].push({
      key: k, kind, early, plays: r.plays,
      v: {
        depth: r.plays / Math.max(1, nTracks),
        cover: covered == null ? null : covered / Math.max(1, tl.length),
        stay: early ? null : staying(r),
        peak: ch ? -ch.peak : -1e9,
        life: ch ? ch.wks + 2 * ch.at1 : 0,
        honours: cert
      },
      raw: { plays: r.plays, nTracks, hasTl: !!tl, covered, months: r.months.size, late6: r.late6, late12: r.late12, peak: ch ? ch.peak : null, wks: ch ? ch.wks : 0, at1: ch ? ch.at1 : 0, cert }
    });
  }

  // Rank each pool
  const outSongs = new Map(), outRels = new Map();
  for (const pool of ['song', 'album', 'single']) {
    const list = items[pool];
    if (!list.length) continue;
    // Per signal: where each item ranks in the pool (ties share the middle)
    const pct = {};
    for (const sig of AS_SIGNALS) pct[sig] = _asPercentiles(list, it => it.v[sig]);
    // Tracks played is already a share (0–1) and only albums whose tracklist
    // has been fetched have it, often just a handful: ranking it among so few
    // made "11 of 11 tracks" read as average. Use the share itself.
    pct.cover = list.map(it => it.v.cover);
    const combined = list.map((it, i) => {
      let sum = 0, wsum = 0;
      const parts = {};
      for (const sig of AS_SIGNALS) {
        const p = pct[sig][i];
        if (p == null) continue;
        const w = asWeight(sig);
        parts[sig] = p;
        if (!w) continue;
        sum += p * w; wsum += w;
      }
      return { it, parts, c: wsum ? sum / wsum : 0.5 };
    });
    // Ranked once more so the averages spread back over the whole scale
    const q = _asPercentiles(combined, x => x.c);
    combined.forEach((x, i) => {
      const score = Math.round(_asScoreOfRank(q[i]) * 10) / 10;
      const res = { score, early: x.it.early, kind: x.it.kind, parts: x.parts, raw: x.it.raw };
      (pool === 'song' ? outSongs : outRels).set(x.it.key, res);
    });
  }

  _asCache = { gen, songs: outSongs, rels: outRels };
  // Counted scores feed the memoised artist summaries; drop them
  if (typeof ratingMemoInvalidate === 'function') ratingMemoInvalidate();
  return _asCache;
}

/* For each item, its rank in the list as a share, 0–1 (0 = lowest).
   Tied items share the middle of their tie ("mid-rank"), so eleven albums
   all played in full don't all read as the lowest of the eleven.
   Items without the value get null. One item alone sits in the middle. */
function _asPercentiles(list, get) {
  const idx = [];
  list.forEach((it, i) => { const v = get(it); if (v != null && !isNaN(v)) idx.push([v, i]); });
  const out = new Array(list.length).fill(null);
  if (!idx.length) return out;
  if (idx.length === 1) { out[idx[0][1]] = 0.5; return out; }
  idx.sort((a, b) => a[0] - b[0]);
  const n = idx.length;
  let j = 0;
  while (j < n) {
    let e = j;
    while (e + 1 < n && idx[e + 1][0] === idx[j][0]) e++;
    const p = ((j + e) / 2) / (n - 1);  // the middle of the tie, as a share
    for (let k = j; k <= e; k++) out[idx[k][1]] = p;
    j = e + 1;
  }
  return out;
}

// ─── LOOKUPS ──────────────────────────────────────────────────────────────

// A song's / release's Listening Score: { score, early, kind, parts, raw } or null.
// null when the feature is off, or the item has fewer than AS_MIN_PLAYS plays.
function asSong(key)    { if (!asOn() || !allPlays || !allPlays.length) return null; return _asBuild().songs.get(key) || null; }
function asRelease(key) { if (!asOn() || !allPlays || !allPlays.length) return null; return _asBuild().rels.get(key) || null; }

/* What a song shows: your score, or its Listening Score.
   { score, state: 'yours' | 'listening', early } or null. */
function asSongView(key) {
  const own = ratingSongScore(key);
  if (own != null) return { score: own, state: 'yours' };
  const ls = asSong(key);
  return ls ? { score: ls.score, state: 'listening', early: ls.early } : null;
}

/* What an album shows (AUTO-SCORE-PLAN.md, decided 2026-11-14):
     yours      — every track with a score has your score (or nothing is
                  missing). The album score is exactly ratingAlbumScore().
     mixed      — some of your scores, the gaps filled per track with the
                  song's Listening Score. Aspects are yours or left out.
     listening  — nothing of yours: the release's own Listening Score (or,
                  for a release under AS_MIN_PLAYS plays whose songs have
                  scores from other releases, the average of those).
   { score, state, yourTracks, lsTracks, early } or null. */
function asAlbumView(albumKey) {
  const own = ratingAlbumScore(albumKey);
  if (!asOn()) return own ? { score: own.score, state: 'yours', yourTracks: own.ratedTracks, lsTracks: 0 } : null;
  const tracks = ratingAlbumTrackKeys(albumKey);
  let yours = 0, filled = 0, sum = 0;
  for (const tr of tracks) {
    const o = ratingSongScore(tr.key);
    if (o != null) { yours++; sum += o; continue; }
    const ls = asSong(tr.key);
    if (ls) { filled++; sum += ls.score; }
  }
  if (!own) {
    const rel = asRelease(albumKey);
    if (rel) return { score: rel.score, state: 'listening', yourTracks: 0, lsTracks: filled, early: rel.early };
    if (filled) return { score: Math.round(sum / filled * 10) / 10, state: 'listening', yourTracks: 0, lsTracks: filled };
    return null;
  }
  if (!filled) return { score: own.score, state: 'yours', yourTracks: yours, lsTracks: 0 };
  // The same 75/25 rule as the album's own score, with the track half
  // now covering every track that has any score
  const trackAvg = sum / (yours + filled);
  const aspectAvg = ratingAlbumAspectScore(albumKey);
  const tw = own.trackWeight;
  const total = aspectAvg == null ? trackAvg : trackAvg * tw + aspectAvg * (1 - tw);
  return { score: Math.round(total * 10) / 10, state: 'mixed', yourTracks: yours, lsTracks: filled, trackAvg: Math.round(trackAvg * 10) / 10, aspectAvg };
}

/* The scores Records, Awards, smart playlists and the artist verdict use.
   Your own scores only, unless "Count Listening Scores where I haven't
   rated" is on — then the score you see on the chips. */
function ratingSongScoreCounted(key) {
  if (!asCounts()) return ratingSongScore(key);
  const v = asSongView(key);
  return v ? v.score : null;
}
function ratingAlbumScoreCounted(albumKey) {
  if (!asCounts()) { const r = ratingAlbumScore(albumKey); return r ? r.score : null; }
  const v = asAlbumView(albumKey);
  return v ? v.score : null;
}
// Is this counted score (partly) a Listening Score? For the outlined look in lists.
function asIsCountedLs(kind, key) {
  if (!asCounts()) return false;
  const v = kind === 'song' ? asSongView(key) : asAlbumView(key);
  return !!v && v.state !== 'yours';
}

// ─── DISPLAY ──────────────────────────────────────────────────────────────

// The score chip in its state's look: filled (yours), half-filled (mixed),
// outlined (listening)
function asChip(view, extraCls) {
  if (!view) return '';
  if (view.state === 'yours') return ratingChip(view.score, extraCls);
  const band = ratingBand(view.score);
  const tip = view.state === 'mixed'
    ? t('as_tip_mixed', { score: ratingFmt(view.score), n: view.yourTracks, of: view.yourTracks + view.lsTracks })
    : t('as_tip_ls', { score: ratingFmt(view.score) });
  return `<span class="rt-chip ${band.cls} rt-chip--${view.state === 'mixed' ? 'mix' : 'ls'}${extraCls ? ' ' + extraCls : ''}" title="${esc(tip)}">${ratingFmt(view.score)}</span>`;
}

// The words for the state, under a ring
function asStateLabel(view) {
  if (!view || view.state === 'yours') return '';
  return view.state === 'mixed' ? t('as_mixed') : t('as_name');
}

/* "Why this score": one row per signal with what was measured and where
   that sits in your library. kind = 'song' or 'album'. */
function asWhyHTML(res, kind) {
  if (!res) return '';
  const r = res.raw;
  const rows = [];
  const certName = n => n <= 0 ? t('as_v_cert_none') : n === 1 ? t('cert_gold') : n === 2 ? t('cert_plat') : (typeof tDiamondLabel === 'function' ? tDiamondLabel(n - 2) : 'Diamond');
  const add = (sig, val) => {
    const p = res.parts[sig];
    if (p == null) return;
    rows.push(`<div class="as-why-row">
      <span class="as-why-l">${esc(t('as_sig_' + sig))}</span>
      <span class="as-why-v">${esc(val)}</span>
      <span class="as-why-bar" title="${esc(t('as_why_rank', { n: Math.round(p * 100) }))}"><i style="width:${(p * 100).toFixed(0)}%"></i></span>
    </div>`);
  };
  add('depth', kind === 'song' ? tCount('plays', r.plays)
    : t('as_v_depth', { n: (r.plays / Math.max(1, r.nTracks)).toFixed(1) }));
  if (r.covered != null) add('cover', t('as_v_cover', { n: r.covered, of: r.nTracks }));
  add('stay', t('as_v_months', { m: tCount('months', r.months) }) + (r.late12 ? ' · ' + t('as_v_year_on') : r.late6 ? ' · ' + t('as_v_half_on') : ''));
  add('peak', r.peak ? t('as_v_peak', { n: r.peak }) : t('as_v_never'));
  add('life', t('as_v_weeks', { w: tCount('weeks', r.wks) }) + (r.at1 ? ' · ' + t('as_v_at1', { w: tCount('weeks', r.at1) }) : ''));
  add('honours', certName(r.cert));
  return `<div class="as-why">
    <div class="as-why-h"><span class="ao-kicker">${esc(t('as_why'))}</span><span class="as-why-hint">${esc(t('as_why_hint'))}</span></div>
    ${rows.join('')}
    ${res.early ? `<p class="as-why-early">${esc(t('as_early_note'))}</p>` : ''}
    ${kind === 'album' && !r.hasTl && res.kind === 'album' ? `<p class="as-why-note">${esc(t('as_no_tracklist'))}</p>` : ''}
  </div>`;
}

// ─── SETTINGS UI ──────────────────────────────────────────────────────────
/* Settings → Releases → Listening Scores: the switch, the "count it" switch,
   one slider per signal and a live preview of five releases. */

function asSyncSettingsUI() {
  const on = document.getElementById('asOn');
  if (!on) return;
  on.checked = asOn();
  const cnt = document.getElementById('asCount');
  if (cnt) cnt.checked = !!asCfg().count;
  const opts = document.getElementById('asOpts');
  if (opts) opts.hidden = !asOn();
  const box = document.getElementById('asWeights');
  if (box) {
    box.innerHTML = AS_SIGNALS.map(sig => `<label class="as-w-row">
      <span class="as-w-l">${esc(t('as_sig_' + sig))}<span class="as-w-d">${esc(t('as_sig_' + sig + '_d'))}</span></span>
      <input type="range" min="0" max="40" step="1" value="${asWeight(sig)}" oninput="asSetWeight('${sig}',this.value);this.nextElementSibling.textContent=this.value" aria-label="${esc(t('as_sig_' + sig))}">
      <b class="as-w-v">${asWeight(sig)}</b>
    </label>`).join('');
  }
  _asRenderSettingsPreview();
}

// Five of the most played albums and their Listening Scores, redrawn as the
// sliders move, so the effect of a weight is visible straight away
function _asRenderSettingsPreview() {
  const el = document.getElementById('asPreview');
  if (!el) return;
  if (!asOn() || !allPlays || !allPlays.length) { el.innerHTML = ''; return; }
  const rels = [..._asBuild().rels.entries()].filter(([, r]) => r.kind === 'album');
  // Spread across the scale: the top, the middle and the bottom of what you play most
  const top = rels.sort((a, b) => b[1].raw.plays - a[1].raw.plays).slice(0, 40);
  const pick = [0, 1, Math.floor(top.length / 2), top.length - 2, top.length - 1]
    .filter((v, i, a) => v >= 0 && v < top.length && a.indexOf(v) === i).map(i => top[i]);
  el.innerHTML = pick.length ? `<div class="as-prev-h ao-kicker">${esc(t('as_preview'))}</div>` + pick.map(([k, r]) => {
    const [name, artist] = k.split('|||');
    return `<div class="as-prev-row"><span class="as-prev-t"><b>${esc(name)}</b><span>${esc(artist || '')}</span></span>${asChip({ score: r.score, state: 'listening' })}</div>`;
  }).join('') : '';
}

window.asSetOn = asSetOn;
window.asSetCount = asSetCount;
window.asSetWeight = asSetWeight;
window.asResetWeights = asResetWeights;
window.asOnTracklist = asOnTracklist;
