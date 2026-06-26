export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api/, "") || "/";
  const targetUrl = "https://api-enhanced-lovat-zeta.vercel.app" + path + url.search;

  const headers = new Headers(request.headers);
  headers.set("User-Agent", "Mozilla/5.0");

  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  try {
    const body = request.method !== "GET" && request.method !== "HEAD"
      ? await request.text() : undefined;
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: body,
    });

    const newHeaders = new Headers(response.headers);
    newHeaders.set("Access-Control-Allow-Origin", "*");

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}
