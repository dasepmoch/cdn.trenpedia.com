export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    const wasabiUrl = `https://s3.ap-southeast-1.wasabisys.com/trenpedia${path}`;

    // Kirim request ke Wasabi dengan semua header, termasuk Range
    const wasabiRequest = new Request(wasabiUrl, {
      method: request.method,
      headers: request.headers,
      redirect: 'manual'
    });

    const originResponse = await fetch(wasabiRequest);

    // Kalau Wasabi kasih redirect (jarang tapi bisa)
    if (originResponse.status === 302) {
      const redirectUrl = originResponse.headers.get('Location');
      const finalResponse = await fetch(redirectUrl, {
        method: request.method,
        headers: request.headers
      });

      const finalHeaders = new Headers(finalResponse.headers);
      finalHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');

      return new Response(finalResponse.body, {
        status: finalResponse.status,
        statusText: finalResponse.statusText,
        headers: finalHeaders
      });
    }

    // Kalau tidak redirect, langsung kirim balik respon Wasabi
    const headers = new Headers(originResponse.headers);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new Response(originResponse.body, {
      status: originResponse.status,
      statusText: originResponse.statusText,
      headers
    });
  }
}
