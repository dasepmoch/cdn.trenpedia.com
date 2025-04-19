index.jsexport default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    const wasabiUrl = `https://s3.ap-southeast-1.wasabisys.com/trenpedia${path}`;
    return fetch(wasabiUrl);
  }
}
