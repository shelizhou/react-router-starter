import { Link } from "react-router";

export function HomePage() {
  return (
    <div className="page home">
      <h1>Welcome to React Router v7</h1>
      <p className="subtitle">A modern starter template with Vite and TypeScript</p>

      <div className="features">
        <div className="feature-card">
          <h3>File-Based Routing</h3>
          <p>Organize your routes in a clean, predictable structure.</p>
        </div>
        <div className="feature-card">
          <h3>TypeScript</h3>
          <p>Full type safety across your entire application.</p>
        </div>
        <div className="feature-card">
          <h3>Fast Dev Server</h3>
          <p>Powered by Vite for instant HMR and optimized builds.</p>
        </div>
        <Link to="/doc" className="feature-card feature-link">
          <h3>Document</h3>
          <p>View the embedded document.</p>
        </Link>
        <Link to="/store" className="feature-card feature-link">
          <h3>Data Store</h3>
          <p>Key-value storage with Cloudflare D1.</p>
        </Link>
      </div>

      <div className="actions">
        <Link to="/about" className="btn btn-primary">
          Learn More
        </Link>
      </div>
    </div>
  );
}
