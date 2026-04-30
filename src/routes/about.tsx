import { Link } from "react-router";

export function AboutPage() {
  return (
    <div className="page about">
      <h1>About</h1>
      <p>
        This is a starter template built with <strong>React Router v7</strong>,
        the latest version of the most popular routing library for React.
      </p>

      <h2>What&apos;s Included</h2>
      <ul>
        <li>React Router v7 with <code>createBrowserRouter</code></li>
        <li>Vite as the build tool</li>
        <li>TypeScript for type safety</li>
        <li>Component-based route definitions</li>
        <li>Nested layouts via <code>&lt;Outlet /&gt;</code></li>
      </ul>

      <h2>Getting Started</h2>
      <pre>
        <code>
          npm install{'\n'}
          npm run dev
        </code>
      </pre>

      <div className="actions">
        <Link to="/" className="btn btn-secondary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
