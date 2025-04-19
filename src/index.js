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

    // Deteksi apakah ini permintaan streaming parsial (Range)
    const isRangeRequest = request.headers.has("range");
    const isPartial = originResponse.status === 206;

    // Kalau bukan Range dan bukan 206, kita cache
    if (!isRangeRequest && !isPartial) {
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
    }

    return new Response(originResponse.body, {
      status: originResponse.status,
      statusText: originResponse.statusText,
      headers
    });
  }
}
