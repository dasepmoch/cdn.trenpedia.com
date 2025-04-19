export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    const wasabiUrl = `https://s3.ap-southeast-1.wasabisys.com/trenpedia${path}`;

    // Teruskan semua header asli dari user ke Wasabi (termasuk Range!)
    const wasabiRequest = new Request(wasabiUrl, {
      method: request.method,
      headers: request.headers,
    });

    const originResponse = await fetch(wasabiRequest);

    // Copy semua header dari Wasabi
    const headers = new Headers(originResponse.headers);

    // Tambahkan cache-control (ini tidak overwrite Range)
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new Response(originResponse.body, {
      status: originResponse.status,
      statusText: originResponse.statusText,
      headers,
    });
  }
}
