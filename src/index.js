export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    const wasabiUrl = `https://s3.ap-southeast-1.wasabisys.com/trenpedia${path}`;
    const originResponse = await fetch(wasabiUrl);

    const newHeaders = new Headers(originResponse.headers);
    newHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new Response(originResponse.body, {
      status: originResponse.status,
      headers: newHeaders
    });
  }
}
