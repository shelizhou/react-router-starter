export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // API routes
    if (path.startsWith("/api/items")) {
      return handleApi(request, env, url);
    }

    // Try to serve the static asset
    const assetUrl = new URL(path, url.origin);
    const asset = await env.ASSETS.fetch(new Request(assetUrl.toString()));

    if (asset.ok) {
      return asset;
    }

    // SPA fallback: serve index.html for client-side routes
    return env.ASSETS.fetch(new Request(new URL("/index.html", url.origin).toString()));
  },
};

async function handleApi(request: Request, env: Env, url: URL): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    if (request.method === "GET") {
      const { results } = await env.DB.prepare("SELECT * FROM items ORDER BY updated_at DESC").all();
      return Response.json(results, {
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    if (request.method === "POST") {
      const body = await request.json();
      const { key, value } = body;
      if (!key) {
        return Response.json({ error: "key is required" }, { status: 400 });
      }
      const id = crypto.randomUUID();
      await env.DB
        .prepare(
          "INSERT INTO items (id, key, value) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = datetime('now')"
        )
        .bind(id, key, value, value)
        .run();
      return Response.json({ id, key, value }, {
        status: 201,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    if (request.method === "DELETE") {
      const id = url.searchParams.get("id");
      if (!id) {
        return Response.json({ error: "id is required" }, { status: 400 });
      }
      await env.DB.prepare("DELETE FROM items WHERE id = ?").bind(id).run();
      return new Response(null, { status: 204 });
    }

    return new Response("Method not allowed", { status: 405 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
}
