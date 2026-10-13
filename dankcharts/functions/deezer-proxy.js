export async function onRequest(context) {
  const url = new URL(context.request.url);
  const deezerPath = url.searchParams.get('url');

  if (!deezerPath || deezerPath.includes('://') || deezerPath.startsWith('/')) {
    return new Response('Bad request', { status: 400 });
  }

  const deezerUrl = 'https://api.deezer.com/' + deezerPath;
  const reply = (body, status, contentType, cacheable) => new Response(body, {
    status,
    headers: {
      'Content-Type': contentType || 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': cacheable ? 'public, max-age=3600' : 'no-store',
    },
  });

  // Good answers are kept at the edge for an hour, in Cloudflare's cache by
  // hand rather than with fetch's cf.cacheEverything: that cached *every*
  // answer, and Deezer reports "quota exceeded" (code 4) and "service busy"
  // (code 700) inside a normal 200. One busy moment then made every lookup
  // that hit it come back empty for the hour — the app read it as "Deezer has
  // no picture". Now an error answer is passed through and never stored.
  const cache = caches.default;
  const cacheKey = new Request(deezerUrl);
  const hit = await cache.match(cacheKey);
  if (hit) return reply(await hit.arrayBuffer(), 200, hit.headers.get('Content-Type'), true);

  const response = await fetch(deezerUrl);
  const body = await response.arrayBuffer();
  const contentType = response.headers.get('Content-Type');
  const head = new TextDecoder().decode(body.slice(0, 64));
  const ok = response.ok && !/^\s*\{\s*"error"/.test(head);

  if (ok) {
    context.waitUntil(cache.put(cacheKey, new Response(body.slice(0), {
      headers: { 'Content-Type': contentType || 'application/json', 'Cache-Control': 'public, max-age=3600' },
    })));
  }
  return reply(body, response.status, contentType, ok);
}
