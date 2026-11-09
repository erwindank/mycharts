// World Charts proxy: fetches a real-world chart page (Billboard or kworb.net)
// and returns its rows as small JSON for the World Charts tab.
//
// Why a proxy: neither billboard.com nor kworb.net sends CORS headers, so the
// browser can't read them directly. Billboard's chart pages are also huge (3–5 MB
// of HTML), so parsing here means the browser only downloads a few KB.
//
// GET /world-charts?chart=list                            → the chart menu
// GET /world-charts?chart=hot-100
// GET /world-charts?chart=billboard-200&date=2026-11-07   (a past week, Billboard only)
//   → { chart, title, kind, period, date, source, sourceUrl, fetchedAt, stale?, rows }
//
// Chart fields:
//   - `kind`   'songs' | 'albums' | 'videos'. It tells the app what to match
//              the rows against in the user's library. 'videos' are YouTube
//              video titles, which we split into artist + title as well as we can.
//   - `period` 'week' | 'day'. It's what `last` and `onChart` count in.
//   - `stale: true` means the source couldn't be read just now, so this is the
//     last good copy we saved.
//
// Row fields (anything a source doesn't have is left out):
//   rank, title, artist
//   status     'new' | 're' | null (a re-entry is 're')
//   last       position last period, null for new and re-entries
//   peak, onChart (weeks/days on chart), atPeak (weeks/days at the peak)
//   image      cover URL (Billboard only)
//   debutPos, debutDate (Billboard only)
//   feat       featured artists (Spotify only)
//   streams, streamsChange, total (Spotify only)
//   views, likes (YouTube only)
//   spotifyId / videoId: the track or video id, for players and artwork later
//   raw        the untouched video title (YouTube only)
//
// Caching (no cron, same idea as grammy-proxy): the first visitor after the
// cache runs out triggers a fresh fetch, and everyone after that gets the saved
// copy. Each good result is also saved under a separate long-lived "last good"
// key. If a source changes its layout or blocks us, we serve that copy
// instead of an error.

// Some Billboard edges answer 403 to a bare fetch, so for Billboard we look like a browser.
const UA_BROWSER = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
// kworb is run by one person, so we say plainly who we are.
const UA_KWORB = 'dankcharts.fm chart reader (+https://dankcharts.fm)';

const HOUR = 3600;
const DAY = 86400;

// Every chart the tab can show lives here. Adding a chart = one entry here
// (plus a parser if it's a new source).
//   path:   the chart's page on the source site
//   kind:   what the rows are (songs / albums / videos)
//   period: what one step of the chart is (week / day)
//   ttl:    how long a fresh copy is kept, in seconds
//   min:    fewest rows we accept as a real parse. Fewer than this means
//           the layout changed, so we fall back to the last good copy.
//   minPast: the same for a past week (old charts could be shorter)
//   first:  the oldest week the source has (Billboard only), for the week picker
const CHARTS = {
  'hot-100': {
    title: 'Billboard Hot 100', source: 'billboard', kind: 'songs', period: 'week',
    path: 'hot-100', ttl: 6 * HOUR, min: 90, minPast: 90, first: '1958-08-04',
  },
  'billboard-200': {
    title: 'Billboard 200', source: 'billboard', kind: 'albums', period: 'week',
    path: 'billboard-200', ttl: 6 * HOUR, min: 180, minPast: 100, first: '1963-08-17',
  },
  'spotify-global-daily': {
    title: 'Spotify Global Daily', source: 'kworb', kind: 'songs', period: 'day',
    path: 'spotify/country/global_daily.html', ttl: 3 * HOUR, min: 150,
  },
  'spotify-global-weekly': {
    title: 'Spotify Global Weekly', source: 'kworb', kind: 'songs', period: 'week',
    path: 'spotify/country/global_weekly.html', ttl: 6 * HOUR, min: 150,
  },
  'youtube-top': {
    // kworb's list is 500 long. We keep the top 200 so it matches Spotify.
    title: 'YouTube Most Viewed', source: 'kworb', kind: 'videos', period: 'day',
    path: 'youtube/', ttl: 3 * HOUR, min: 150, max: 200,
  },
};

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const id = (url.searchParams.get('chart') || '').trim().toLowerCase();
  const date = (url.searchParams.get('date') || '').trim();
  const def = CHARTS[id];

  // ?chart=list returns the chart menu, so the app never hard-codes it.
  if (id === 'list') {
    return json({ charts: Object.entries(CHARTS).map(([k, c]) => ({
      id: k, title: c.title, source: c.source, kind: c.kind, period: c.period,
      pastWeeks: c.source === 'billboard', first: c.first || null })) }, 200, HOUR);
  }
  if (!def) return json({ error: 'Unknown chart' }, 400, 0);
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) return json({ error: 'Bad date' }, 400, 0);
  // kworb has no history pages, so it only has the current chart.
  if (date && def.source !== 'billboard') return json({ error: 'No past weeks for this chart' }, 400, 0);

  const cache = caches.default;
  const keyBase = `${url.origin}/world-charts?chart=${id}${date ? '&date=' + date : ''}`;
  const freshKey = new Request(keyBase, { method: 'GET' });
  const lastKey = new Request(keyBase + '&last=1', { method: 'GET' });

  const hit = await cache.match(freshKey);
  if (hit) return hit;

  let payload = null;
  try {
    payload = await fetchChart(id, def, date);
  } catch (_) {
    payload = null;
  }

  if (payload) {
    // A past week never changes, so it can be kept for a long time.
    const ttl = date ? 30 * DAY : def.ttl;
    const res = json(payload, 200, ttl);
    context.waitUntil(Promise.all([
      cache.put(freshKey, res.clone()),
      cache.put(lastKey, json(payload, 200, 30 * DAY)),
    ]));
    return res;
  }

  // The source failed. Serve the last good copy, marked stale, for a short
  // time so we try the source again soon.
  const last = await cache.match(lastKey);
  if (last) {
    const body = await last.json();
    body.stale = true;
    return json(body, 200, 15 * 60);
  }
  return json({ error: 'Chart could not be loaded' }, 502, 0);
}

function json(body, status, maxAge) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': maxAge ? `public, max-age=${maxAge}` : 'no-store',
    },
  });
}

// Fetch + parse one chart. Returns null if the result doesn't look like a real
// chart (too few rows), so the caller falls back to the last good copy.
async function fetchChart(id, def, date) {
  const isBB = def.source === 'billboard';
  const sourceUrl = isBB
    ? `https://www.billboard.com/charts/${def.path}/${date ? date + '/' : ''}`
    : `https://kworb.net/${def.path}`;
  const r = await fetch(sourceUrl, {
    headers: { 'User-Agent': isBB ? UA_BROWSER : UA_KWORB, 'Accept': 'text/html' },
    // Let Cloudflare keep the raw page for a bit, too, so two cold visitors in
    // different places don't both download it from the source.
    cf: { cacheTtl: date ? DAY : HOUR, cacheEverything: true },
  });
  if (!r.ok) return null;
  const html = await r.text();

  const parsed = isBB ? parseBillboard(html)
    : def.kind === 'videos' ? parseKworbYouTube(html)
    : parseKworbSpotify(html);
  // Old weeks can be shorter than today's chart (the album chart had only 150
  // places before 1967), so a past week only needs `minPast` rows.
  if (parsed.rows.length < (date ? (def.minPast || def.min) : def.min)) return null;
  if (def.max) parsed.rows = parsed.rows.slice(0, def.max);

  return {
    chart: id, title: def.title, kind: def.kind, period: def.period,
    date: parsed.date || date || null,
    source: isBB ? 'Billboard' : 'kworb.net',
    // A past week links to the chart's own date (Billboard moves any day to its
    // chart week, so ?date=2026-10-28 is the chart of 2026-10-31)
    sourceUrl: isBB && date && parsed.date ? `https://www.billboard.com/charts/${def.path}/${parsed.date}/` : sourceUrl,
    fetchedAt: new Date().toISOString(),
    rows: parsed.rows,
  };
}

// ── Billboard parser ──────────────────────────────────────────────────────────
// Each chart row sits in a "o-chart-results-list-row-container" block. Inside:
//   - the rank is the first number
//   - the title is the <h3 id="title-of-a-story">
//   - the artist is the <span> right after it (sometimes links, sometimes text)
//   - the cover is an <img>. Rows lower down are lazy, with the real URL in
//     data-lazy-src. Billboard has no cover for a few rows and shows a grey
//     placeholder gif. We leave those empty.
//   - "NEW" / "RE- ENTRY" labels appear before the title
//   - the stats are written as "LW 6 PEAK 2 [WEEKS AT NO. 1 26] WEEKS ON CHART 30"
//   - the open detail panel adds "Debut Position 95 Debut Chart Date 04/18/26"
function parseBillboard(html) {
  const dateM = html.match(/id="chart-date-picker"[^>]*data-date="(\d{4}-\d{2}-\d{2})"/);
  const parts = html.split('o-chart-results-list-row-container').slice(1);
  const rows = [];
  for (const p of parts) {
    const h3 = p.match(/<h3[^>]*id="title-of-a-story"[^>]*>([\s\S]*?)<\/h3>\s*<span[^>]*>([\s\S]*?)<\/span>/);
    if (!h3) continue;
    const title = clean(h3[1]);
    const artist = clean(h3[2]);

    // Plain text of the row (svgs and tags removed) for the number fields.
    const text = clean(p.replace(/<svg[\s\S]*?<\/svg>/g, ' '));
    const rankM = text.match(/^\D*?(\d{1,3})\b/);
    if (!rankM || !title) continue;

    // The stats appear twice (desktop and phone copies). match() takes the
    // first, and both copies are the same.
    const stats = text.match(/LW (\S+) PEAK (\d+)(?: WEEKS AT NO\. 1 (\d+))? WEEKS ON CHART (\d+)/);
    const debut = text.match(/Debut Position (\d+) Debut Chart Date (\d{2})\/(\d{2})\/(\d{2})/);
    const before = text.slice(0, text.indexOf(title) >= 0 ? text.indexOf(title) : 40);
    const status = /\bNEW\b/.test(before) ? 'new' : /RE-\s?ENTRY/.test(before) ? 're' : null;

    // Cover: prefer the lazy URL (bigger), skip Billboard's grey placeholder.
    const img = p.match(/data-lazy-src="([^"]+)"/) || p.match(/<img[^>]*src="(https:\/\/charts-static[^"]+)"/);
    const image = img && !/lazyload-fallback/.test(img[1]) ? img[1] : null;

    rows.push({
      rank: +rankM[1],
      title,
      artist,
      image,
      status,
      last: stats && /^\d+$/.test(stats[1]) ? +stats[1] : null,
      peak: stats ? +stats[2] : null,
      onChart: stats ? +stats[4] : null,
      atPeak: stats && stats[3] ? +stats[3] : null,
      debutPos: debut ? +debut[1] : null,
      // Billboard writes MM/DD/YY. Two-digit years: 58 and up = 1900s (the
      // Hot 100 began in 1958).
      debutDate: debut ? `${+debut[4] >= 58 ? '19' : '20'}${debut[4]}-${debut[2]}-${debut[3]}` : null,
    });
  }
  return { date: dateM ? dateM[1] : null, rows };
}

// ── kworb parsers ─────────────────────────────────────────────────────────────
// kworb pages are plain tables: one <tr> per row in the <tbody>, and the chart
// date in the page title ("Spotify Daily Chart - Global - 2026/11/07").
//
// The change column (2nd cell) is "+3" (up 3), "-1", "=" (same), "NEW" or "RE".
// We turn that into last period's position, like Billboard's LW.
function kworbRows(html) {
  const body = html.slice(html.indexOf('<tbody'));
  return [...body.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)]
    .map(m => [...m[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(c => c[1]));
}
function kworbDate(html) {
  const m = html.match(/class="pagetitle"[^>]*>[\s\S]*?(\d{4})[\/-](\d{2})[\/-](\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}
function kworbMove(rank, change) {
  const c = clean(change);
  if (c === 'NEW') return { status: 'new', last: null };
  if (c === 'RE') return { status: 're', last: null };
  if (c === '=') return { status: null, last: rank };
  // "+3" means it climbed 3 places, so it was 3 lower (rank + 3) last time.
  if (/^[+-]\d+$/.test(c)) return { status: null, last: rank + Number(c) };
  return { status: null, last: null };
}
const num = s => { const n = Number(clean(s).replace(/[,+]/g, '')); return Number.isFinite(n) ? n : null; };

// Spotify (daily and weekly). Cells:
//   daily:  Pos | P+ | Artist and Title | Days | Pk | (x?) | Streams | Streams+ | 7Day | 7Day+ | Total
//   weekly: Pos | P+ | Artist and Title | Wks  | Pk | (x?) | Streams | Streams+ | Total
// The title cell links each lead artist (../artist/ID), then the track
// (../track/ID), then featured artists inside "(w/ ...)".
function parseKworbSpotify(html) {
  const rows = [];
  for (const c of kworbRows(html)) {
    if (c.length < 9) continue;
    const rank = num(c[0]);
    if (!rank) continue;
    const cell = c[2];
    const trackAt = cell.indexOf('../track/');
    if (trackAt < 0) continue;
    const links = re => [...cell.matchAll(re)].map(m => ({ at: m.index, id: m[1], name: clean(m[2]) }));
    const artists = links(/<a href="\.\.\/artist\/([^".]+)\.html">([\s\S]*?)<\/a>/g);
    const track = links(/<a href="\.\.\/track\/([^".]+)\.html">([\s\S]*?)<\/a>/g)[0];
    const lead = artists.filter(a => a.at < track.at).map(a => a.name);
    const feat = artists.filter(a => a.at > track.at).map(a => a.name);
    const atPeak = (clean(c[5]).match(/\d+/) || [])[0];
    rows.push({
      rank,
      title: track.name,
      artist: lead.join(', '),
      ...(feat.length ? { feat } : {}),
      ...kworbMove(rank, c[1]),
      onChart: num(c[3]),
      peak: num(c[4]),
      atPeak: atPeak ? +atPeak : null,
      streams: num(c[6]),
      streamsChange: num(c[7]) == null ? null : Number(clean(c[7]).replace(/,/g, '')),
      total: num(c[c.length - 1]),
      spotifyId: track.id,
    });
  }
  return { date: kworbDate(html), rows };
}

// YouTube most viewed (past 24 hours). Cells: Pos | change | Video | Views | Likes.
// The video link is either "video/ID.html" or a full youtube.com watch link.
function parseKworbYouTube(html) {
  const rows = [];
  for (const c of kworbRows(html)) {
    if (c.length < 5) continue;
    const rank = num(c[0]);
    if (!rank) continue;
    const link = c[2].match(/href="([^"]+)"/);
    const idM = link && (link[1].match(/video\/([\w-]{11})\.html/) || link[1].match(/[?&]v=([\w-]{11})/));
    const raw = clean(c[2]);
    if (!raw) continue;
    const { artist, title } = splitVideoTitle(raw);
    rows.push({
      rank, title, artist, raw,
      ...kworbMove(rank, c[1]),
      views: num(c[3]),
      likes: num(c[4]),
      videoId: idM ? idM[1] : null,
    });
  }
  return { date: kworbDate(html), rows };
}

// "Shakira, Burna Boy - Dai Dai (Official Video)" → { artist: "Shakira, Burna Boy", title: "Dai Dai" }
// Video titles are free text, so this is a best guess. With no " - " in the
// title we can't tell the artist, so artist is null and the app falls back to
// matching on the title alone.
function splitVideoTitle(raw) {
  // Tidy first, then split. Order matters:
  //   1. drop bracketed video tags: (Official Video), [Lyrics], (Video Oficial)…
  //      ("Ao Vivo" = live in Portuguese, kept out of this list so live
  //      versions stay visible as such.)
  //   2. cut everything after the first " | ": that part is credits/cast
  //   3. drop loose tags at the end: M/V, Official (Lyric/Music) Video, #hashtags
  //   4. strip the curly quotes some labels wrap titles in
  const s = raw
    .replace(/\s*[(\[][^)\]]*\b(official|oficial|video|audio|lyrics?|letra|visuali[sz]er|m\/?v|mv|clip|full song)\b[^)\]]*[)\]]/gi, '')
    .replace(/\s*\|.*$/, '')
    .replace(/\s+#\S+/g, '')
    .replace(/\s+(M\/V|MV|(Official )?(Lyric |Music )?Video|Video Klip)\s*$/i, '')
    .replace(/[“”‘’]/g, '')
    .replace(/\s+/g, ' ')
    .trim() || raw;
  const m = s.match(/^(.+?)\s+[-–—]\s+(.+)$/);
  if (!m) return { artist: null, title: s };
  return { artist: m[1].trim(), title: m[2].trim() };
}

// Tags out, entities decoded, spaces squeezed.
function clean(s) {
  return String(s)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#0*39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Exported for local tests.
export { parseBillboard, parseKworbSpotify, parseKworbYouTube, splitVideoTitle, CHARTS };
