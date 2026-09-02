import { createFileRoute } from "@tanstack/react-router";

import { IgnitionGate } from "@/components/hec/ignition/ignition-gate";
import { Journey } from "@/components/hec/journey";
import { ReelsStrip } from "@/components/hec/reels-strip";
import { SiteFooter } from "@/components/hec/site-footer";
import { SiteNav } from "@/components/hec/site-nav";
import { StructuredData } from "@/components/hec/structured-data";
import { INSTAGRAM_URL, REELS, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/hec-content";

const SCHEMA = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "HEC, High Energy Circle",
      alternateName: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/assets/logo/hec-logo.png`,
      description: SITE_DESCRIPTION,
      areaServed: "Dresden",
      ...(INSTAGRAM_URL ? { sameAs: [INSTAGRAM_URL] } : {}),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: "de",
      publisher: { "@id": `${SITE_URL}/#org` },
    },
  ],
});

export const Route = createFileRoute("/")({
  // The home page inherits title/description/og from the root route
  // (app-meta.json) so a shared link to "/" shows the owner's values.
  head: () => ({
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
  component: Index,
});

// The whole page IS the journey: the scrub controller owns media time while
// every chapter stays server-rendered in semantic flow. The ignition intro is
// a load-time canvas overlay that never touches the video elements; the
// meteor's impact is the final chapter, where the join CTA lives.
function Index() {
  return (
    <>
      <IgnitionGate />
      <SiteNav />
      <main>
        <StructuredData json={SCHEMA} />
        <Journey />
        <ReelsStrip reels={REELS} plate="/assets/plates/embers.webp" />
      </main>
      <SiteFooter />
    </>
  );
}
