export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // API routes
    if (path.startsWith("/api/items")) {
      const response = await handleApi(request, env);
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      return response;
    }

    // Try static assets first (CSS, JS, images, etc.)
    try {
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) return asset;
    } catch {
      // Asset not found, fall through to SPA fallback
    }

    // SPA fallback: serve index.html for client-side routes
    try {
      const indexHtml = await env.ASSETS.fetch(new URL("/index.html", request.url));
      return new Response(indexHtml.body, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      });
    } catch (e) {
      return new Response("Internal Server Error", { status: 500 });
    }
  },
};

async function handleApi(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  if (request.method === "GET") {
    const { results } = await env.DB.prepare("SELECT * FROM items ORDER BY updated_at DESC").all();
    return Response.json(results);
  }

  if (request.method === "POST") {
    const { key, value } = await request.json();
    if (!key) return Response.json({ error: "key is required" }, { status: 400 });
    const id = crypto.randomUUID();
    await env.DB
      .prepare("INSERT INTO items (id, key, value) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = datetime('now')")
      .bind(id, key, value, value)
      .run();
    return Response.json({ id, key, value }, { status: 201 });
  }

  if (request.method === "DELETE") {
    const id = url.searchParams.get("id");
    if (!id) return Response.json({ error: "id is required" }, { status: 400 });
    await env.DB.prepare("DELETE FROM items WHERE id = ?").bind(id).run();
    return new Response(null, { status: 204 });
  }

  return new Response("Not Found", { status: 404 });
}
