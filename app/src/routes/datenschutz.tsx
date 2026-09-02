import { createFileRoute } from "@tanstack/react-router";

import { SiteFooter } from "@/components/hec/site-footer";
import { SiteNav } from "@/components/hec/site-nav";
import { LEGAL, SITE_URL } from "@/hec-content";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutz. HEC Dresden" },
      {
        name: "description",
        content: "Datenschutzerklärung der HEC Community-Seite (High Energy Circle, Dresden).",
      },
      { name: "robots", content: "index, nofollow" },
      { property: "og:title", content: "Datenschutz. HEC Dresden" },
      { property: "og:url", content: `${SITE_URL}/datenschutz` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/datenschutz` }],
  }),
  component: DatenschutzPage,
});

function DatenschutzPage() {
  return (
    <>
      <SiteNav />
      <main className="hec-page">
        <article className="hec-legal">
          <h1>Datenschutz</h1>
          <h2>Verantwortlicher</h2>
          <p>
            {LEGAL.name}, {LEGAL.street}, {LEGAL.city}, E-Mail:{" "}
            <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
          </p>
          <h2>Hosting</h2>
          <p>
            Diese Seite wird über das Netzwerk von Cloudflare ausgeliefert. Beim Aufruf werden
            technisch notwendige Daten (IP-Adresse, Zeitpunkt, aufgerufene Seite, Browser) in
            Server-Logs verarbeitet, um die Seite auszuliefern und abzusichern (Art. 6 Abs. 1
            lit. f DSGVO). Die Logs werden nicht mit anderen Daten zusammengeführt.
          </p>
          <h2>Keine Cookies, keine Analyse</h2>
          <p>
            Die Seite setzt keine Cookies und nutzt keine Analyse- oder Tracking-Dienste. Im
            Browser wird lediglich eine sitzungsbezogene Markierung gespeichert, damit die
            Intro-Animation nur einmal abgespielt wird. Sie wird beim Schließen des Tabs
            gelöscht.
          </p>
          <h2>Schriften</h2>
          <p>Alle Schriften werden von dieser Seite selbst geladen, ohne Verbindung zu Dritten.</p>
          <h2>Instagram-Inhalte</h2>
          <p>
            Eingebettete Reels werden erst geladen, wenn du auf die Vorschau klickst. Ab diesem
            Klick stellt dein Browser eine Verbindung zu Instagram (Meta Platforms Ireland Ltd.)
            her und Meta verarbeitet dabei Daten nach seiner eigenen Datenschutzerklärung. Ohne
            Klick fließen keine Daten an Meta.
          </p>
          <h2>WhatsApp</h2>
          <p>
            Der Beitritt zur Gruppe läuft über einen Einladungslink zu WhatsApp. Für die
            Verarbeitung deiner Daten in WhatsApp gilt die Datenschutzerklärung von WhatsApp.
          </p>
          <h2>Deine Rechte</h2>
          <p>
            Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der
            Verarbeitung, Datenübertragbarkeit und Widerspruch sowie das Recht, dich bei einer
            Aufsichtsbehörde zu beschweren. Schreib dafür an die oben genannte E-Mail-Adresse.
          </p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
