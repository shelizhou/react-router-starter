export async function onRequestGet(context: any) {
  const db: D1Database = context.env.DB;
  const { results } = await db.prepare("SELECT * FROM items ORDER BY updated_at DESC").all();
  return Response.json(results);
}

export async function onRequestPost(context: any) {
  const db: D1Database = context.env.DB;
  const { key, value } = await context.request.json();

  if (!key) {
    return Response.json({ error: "key is required" }, { status: 400 });
  }

  const id = crypto.randomUUID();
  await db
    .prepare("INSERT INTO items (id, key, value) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = datetime('now')")
    .bind(id, key, value, value)
    .run();

  return Response.json({ id, key, value }, { status: 201 });
}

export async function onRequestDelete(context: any) {
  const db: D1Database = context.env.DB;
  const url = new URL(context.request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 });
  }

  await db.prepare("DELETE FROM items WHERE id = ?").bind(id).run();
  return new Response(null, { status: 204 });
}
