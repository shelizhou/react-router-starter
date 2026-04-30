import { useState, useEffect } from "react";
import { Link } from "react-router";

interface Item {
  id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export function StorePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/items");
      if (res.ok) setItems(await res.json());
    } catch {
      setError("Failed to connect to the server. Run `npx wrangler pages dev` for local testing.");
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      if (res.ok) {
        setKey("");
        setValue("");
        fetchItems();
      }
    } catch {
      setError("Failed to save item.");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/items?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchItems();
  };

  return (
    <div className="page store">
      <h1>Data Store</h1>
      <p className="subtitle">Key-value storage powered by Cloudflare D1</p>

      {error && <div className="alert">{error}</div>}

      <form onSubmit={handleSubmit} className="store-form">
        <div className="form-group">
          <label>Key</label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="e.g. username"
            required
          />
        </div>
        <div className="form-group">
          <label>Value</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. Alice"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </form>

      <div className="store-list">
        {items.length === 0 ? (
          <p className="empty">No items yet. Add one above.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="store-item">
              <div className="item-content">
                <span className="item-key">{item.key}</span>
                <span className="item-value">{item.value}</span>
              </div>
              <button
                className="btn-delete"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <div className="actions">
        <Link to="/" className="btn btn-secondary">Back to Home</Link>
      </div>
    </div>
  );
}
