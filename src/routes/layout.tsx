import { Outlet, Link } from "react-router";
import "../styles.css";

export function RootLayout() {
  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-inner">
          <Link to="/" className="logo">
            React Router v7
          </Link>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/store">Store</Link>
            <Link to="/doc">Doc</Link>
          </div>
        </div>
      </nav>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <p>Built with React Router v7 + Vite</p>
      </footer>
    </div>
  );
}
