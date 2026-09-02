import { Link } from "@tanstack/react-router";

import { INSTAGRAM_URL } from "@/hec-content";

export function SiteFooter() {
  return (
    <footer className="hec-footer">
      <span>HEC · High Energy Circle · Dresden</span>
      <nav aria-label="Links">
        {INSTAGRAM_URL ? (
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        ) : null}
        <Link to="/impressum">Impressum</Link>
        <Link to="/datenschutz">Datenschutz</Link>
      </nav>
    </footer>
  );
}
