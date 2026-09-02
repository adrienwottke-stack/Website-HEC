import { createFileRoute } from "@tanstack/react-router";

import { SiteFooter } from "@/components/hec/site-footer";
import { SiteNav } from "@/components/hec/site-nav";
import { LEGAL, SITE_URL } from "@/hec-content";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [
      { title: "Impressum. HEC Dresden" },
      { name: "description", content: "Impressum der HEC Community-Seite (High Energy Circle, Dresden)." },
      { name: "robots", content: "index, nofollow" },
      { property: "og:title", content: "Impressum. HEC Dresden" },
      { property: "og:url", content: `${SITE_URL}/impressum` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/impressum` }],
  }),
  component: ImpressumPage,
});

function ImpressumPage() {
  return (
    <>
      <SiteNav />
      <main className="hec-page">
        <article className="hec-legal">
          <h1>Impressum</h1>
          <h2>Angaben gemäß § 5 DDG</h2>
          <address>
            {LEGAL.name}
            <br />
            {LEGAL.street}
            <br />
            {LEGAL.city}
          </address>
          <h2>Kontakt</h2>
          <p>
            E-Mail: <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
          </p>
          <h2>Verantwortlich für den Inhalt</h2>
          <p>{LEGAL.name}, Anschrift wie oben.</p>
          <h2>Haftung für Links</h2>
          <p>
            Diese Seite verlinkt auf WhatsApp und Instagram. Für die Inhalte der verlinkten
            Seiten sind deren Betreiber verantwortlich. Zum Zeitpunkt der Verlinkung waren
            keine Rechtsverstöße erkennbar.
          </p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
