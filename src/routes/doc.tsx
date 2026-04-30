import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

export function DocPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.onload = () => setLoading(false);
    }
  }, []);

  return (
    <div className="doc-page">
      <div className="doc-header">
        <Link to="/" className="btn btn-secondary">
          Back to Home
        </Link>
      </div>
      <div className="doc-container">
        {loading && <div className="doc-loading">Loading document...</div>}
        <iframe
          ref={iframeRef}
          src="/en.html"
          title="Document"
          className="doc-frame"
        />
      </div>
    </div>
  );
}
