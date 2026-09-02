import { CTA_LABEL, WHATSAPP_URL } from "@/hec-content";

import { RingMark } from "./ring-mark";

export function SiteNav() {
  return (
    <header className="hec-nav">
      <a className="hec-nav__mark" href="/" aria-label="HEC, zur Startseite">
        <RingMark className="hec-nav__ring" />
        <span>HEC</span>
      </a>
      <nav className="hec-nav__links" aria-label="Hauptnavigation">
        <a className="hec-nav__link hec-nav__link--plain" href="#wochenplan">
          Wochenplan
        </a>
        <a
          className="hec-nav__link hec-nav__link--cta"
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {CTA_LABEL}
        </a>
      </nav>
    </header>
  );
}
