export async function onRequest(context) {
  const url = new URL(context.request.url);
  const deezerPath = url.searchParams.get('url');

  if (!deezerPath || deezerPath.includes('://') || deezerPath.startsWith('/')) {
    return new Response('Bad request', { status: 400 });
  }

  const deezerUrl = 'https://api.deezer.com/' + deezerPath;

  const response = await fetch(deezerUrl, {
    cf: { cacheTtl: 3600, cacheEverything: true },
  });

  const body = await response.arrayBuffer();

  return new Response(body, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
