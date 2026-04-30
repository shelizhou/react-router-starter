export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

async function serveAsset(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  // Try to serve the requested asset
  try {
    const asset = await env.ASSETS.fetch(request);
    if (asset.ok) return asset;
  } catch {
    // Asset fetch failed, fall through to SPA fallback
  }

  // SPA fallback: return index.html for client-side routes
  try {
    const indexReq = new Request(new URL("/index.html", url.origin));
    const index = await env.ASSETS.fetch(indexReq);
    return new Response(index.body, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch (e: any) {
    return new Response(
      `<!DOCTYPE html><html><body><h1>Asset Error</h1><pre>${e?.message || "unknown"}</pre></body></html>`,
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (path.startsWith("/api/items")) {
      try {
        const response = await handleApi(request, env);
        Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
        return response;
      } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message || "Internal error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return serveAsset(request, env);
  },
};

async function handleApi(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  if (request.method === "GET") {
    const { results } = await env.DB.prepare("SELECT * FROM items ORDER BY updated_at DESC").all();
    return Response.json(results);
  }

  if (request.method === "POST") {
    const body = await request.json();
    const { key, value } = body;
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
