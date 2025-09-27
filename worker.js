
export default {
  async fetch(request, env, ctx) {

    if (new URL(request.url).pathname == "/") {
      return new Response("hello, this is a mirror of download.postgresql.org", {status:200})
    }
    
    const targetHost = 'download.postgresql.org';


    const newUrl = new URL(request.url);
    newUrl.hostname = targetHost;


    let requestHeaders = new Headers(request.headers);

    const newRequest = new Request(newUrl.toString(), {
      headers: requestHeaders,
      method: request.method,
      body: request.body ? await request.text() : undefined,
    });

    try {
      const response = await fetch(newRequest);

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    } catch (error) {
      return new Response(`Error: ${targetHost}\n${error.message}`, {
        status: 502,
        headers: { 'Content-Type': 'text/plain', 'X-Powered-By':'cevin.cc' },
      });
    }
  },
};
