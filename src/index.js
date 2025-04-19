export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    const wasabiUrl = `https://s3.ap-southeast-1.wasabisys.com/trenpedia${path}`;

    const wasabiRequest = new Request(wasabiUrl, {
      method: request.method,
      headers: request.headers,
      redirect: 'manual',
    });

    const originResponse = await fetch(wasabiRequest);
    const headers = new Headers(originResponse.headers);

    // Tambahkan header cache panjang untuk HLS (.ts/.m3u8)
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    // Tambahan CORS + HLS compatibility
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Vary', 'Origin');
    headers.set('Accept-Ranges', 'bytes');

    return new Response(originResponse.body, {
      status: originResponse.status,
      statusText: originResponse.statusText,
      headers
    });
  }
}
