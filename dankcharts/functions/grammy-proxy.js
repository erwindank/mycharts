// Grammy proxy — looks an artist up on grammy.com and hands the app back their
// full Grammy record as JSON.
//
// Why a proxy at all: grammy.com sends no CORS headers, so the browser can't
// read it directly. It's also plain server-rendered WordPress HTML, so the
// parsing has to happen somewhere — doing it here means the browser downloads a
// couple of KB of JSON instead of a 300 KB page per artist, and the edge cache
// means the second visitor to ask about Kendrick Lamar pays nothing.
//
// Two upstream calls per cold lookup:
//   1. Typesense (grammy.com's own public site-search index) to turn a loose
//      artist name into the canonical /artists/<slug>/<id>/ permalink. Guessing
//      the slug doesn't work — SZA lives at /artists/solana-rowe/, Beyoncé at
//      /artists/beyonce-knowles/.
//   2. The artist page itself, whose #artistNomsTable holds every nomination and
//      win they've ever had, server-rendered, one <tr> each.
//
// GET /grammy-proxy?artist=Kendrick%20Lamar
//   → { found, artist, url, image, wins, nominations, entries: [
//         { year, category, title, artists: [...], won } ] }
//   `year` is the ceremony year as grammy.com labels it — the 68th Grammys,
//   held February 2026 for 2025 releases, are year 2026.

// grammy.com's front-end search credentials, lifted from the search modal on
// every page. It's a search-only key meant to be public.
const TYPESENSE_HOST = 'ya4m695201l3bgepp-1.a2.typesense.net';
const TYPESENSE_KEY  = 'cF9udROFiRE2xCH1YznjJLGfSQ08gCUx';

// Some grammy.com edges answer 403 to a bare fetch, so we look like a browser.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const DAY = 86400;

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const artist = (url.searchParams.get('artist') || '').trim();

  if (!artist || artist.length > 120) {
    return json({ error: 'Bad request' }, 400, 0);
  }

  // Normalise the cache key so "Taylor Swift" and "taylor swift" share one entry.
  const cacheKey = new Request(
    `${url.origin}/grammy-proxy?artist=${encodeURIComponent(artist.toLowerCase())}`,
    { method: 'GET' }
  );
  const cache = caches.default;
  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  let payload;
  try {
    payload = await lookupArtist(artist);
  } catch (_) {
    // Upstream hiccup — say so without caching it, so the next try can succeed.
    return json({ found: false, error: 'lookup failed' }, 502, 0);
  }

  const res = json(payload, 200, DAY);
  // A miss is cached too, but only briefly: an artist can pick up their first
  // nomination, and we don't want to insist for a day that they have none.
  if (!payload.found) res.headers.set('Cache-Control', 'public, max-age=3600');
  context.waitUntil(cache.put(cacheKey, res.clone()));
  return res;
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

async function lookupArtist(artist) {
  const doc = await resolveArtist(artist);
  if (!doc) return { found: false, artist };

  const page = await fetch(doc.permalink, {
    headers: { 'User-Agent': UA, 'Accept': 'text/html' },
    cf: { cacheTtl: DAY, cacheEverything: true },
  });
  if (!page.ok) return { found: false, artist };

  const entries = parseNominations(await page.text());

  return {
    found: true,
    artist: decodeEntities(doc.post_title || artist),
    url: doc.permalink,
    image: doc.post_thumbnail || null,
    wins: entries.filter(e => e.won).length,
    nominations: entries.length,
    entries,
  };
}

// ── Name → grammy.com artist page ────────────────────────────────────────────

// Fold accents and punctuation away so "Beyoncé", "BEYONCE" and "Beyonce" all
// compare equal.
function norm(s) {
  return (s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

async function resolveArtist(artist) {
  const q = new URLSearchParams({
    q: artist,
    query_by: 'post_title',
    per_page: '5',
    num_typos: '0',
  });
  const r = await fetch(`https://${TYPESENSE_HOST}/collections/ra_artist/documents/search?${q}`, {
    headers: { 'X-TYPESENSE-API-KEY': TYPESENSE_KEY },
    cf: { cacheTtl: DAY, cacheEverything: true },
  });
  if (!r.ok) throw new Error('typesense ' + r.status);

  const hits = (await r.json()).hits || [];
  const want = norm(artist);
  if (!want) return null;

  // Search will happily return "Gene Szafran" for "SZA", so a hit only counts if
  // it really is this artist: the same name, or the same name plus a surname
  // grammy.com files them under ("Beyoncé" → "Beyoncé Knowles"). Anything looser
  // would credit someone else's Grammys to an artist who has none.
  let loose = null;
  for (const h of hits) {
    const doc = h.document || {};
    if (!doc.permalink) continue;
    const got = norm(decodeEntities(doc.post_title || ''));
    if (got === want) return doc;
    if (!loose && got.startsWith(want + ' ')) loose = doc;
  }
  return loose;
}

// ── Artist page → nomination list ────────────────────────────────────────────

// The table is "All Grammy Awards and Nominations" — every row the artist has,
// including the ones the page hides behind its own "show more" toggle. A winning
// row carries the `winner-row` class; the columns are Year, Category, Artists,
// Title, and a link to the full nominee list we don't need.
function parseNominations(html) {
  const start = html.indexOf('<tbody id="artistNomsTableBody">');
  if (start === -1) return [];
  const end = html.indexOf('</tbody>', start);
  const body = html.slice(start, end === -1 ? undefined : end);

  const entries = [];
  for (const row of body.split(/<tr\b/).slice(1)) {
    const attrs = row.slice(0, row.indexOf('>'));
    const cells = row.match(/<td[^>]*>[\s\S]*?<\/td>/g) || [];
    if (cells.length < 4) continue;

    const year = parseInt(strip(cells[0]), 10);
    const category = strip(cells[1]);
    if (!year || !category) continue;

    // The artists cell is a list of links; fall back to its plain text on the
    // rare row that doesn't link anyone.
    const links = cells[2].match(/<a[^>]*>[\s\S]*?<\/a>/g) || [];
    const artists = (links.length ? links.map(strip) : [strip(cells[2])]).filter(Boolean);

    entries.push({
      year,
      category,
      title: strip(cells[3]),
      artists,
      won: /\bwinner-row\b/.test(attrs),
    });
  }
  return entries;
}

function strip(fragment) {
  return decodeEntities(fragment.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function decodeEntities(s) {
  return (s || '')
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}
