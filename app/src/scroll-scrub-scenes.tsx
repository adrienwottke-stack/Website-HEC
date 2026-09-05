/**
 * Scene data for the HEC journey. The first chapter carries a still, not film:
 * the page opens on a night frame of the world HEC happens in, the copy
 * scrolls over it, and only then does the film ignite. From there one
 * seam-locked chain (the meteor flight past four stations, the atmosphere
 * entry, the impact) runs across the remaining four chapters. Every poster
 * beside a clip is the exact first frame of it. Keep this array a module
 * constant: changing its identity rebuilds the media controller.
 */
import type { ScrollScrubScene, ScrollScrubTheme } from "@/components/scroll-scrub/scroll-scrub";
import { AgendaLedger } from "@/components/hec/agenda-ledger";
import { ChannelReadouts } from "@/components/hec/channel-readouts";
import { HeroCta } from "@/components/hec/hero-cta";
import { ImpactCta } from "@/components/hec/impact-cta";
import { OrbitLink } from "@/components/hec/orbit-link";
import { CTA_LABEL, WHATSAPP_URL } from "@/hec-content";

/** HEC scene: the engine's scene plus how hard the stage scrim darkens the
 * copy side of the frame (0..1). Read by journey.tsx, not by the engine. */
export type HecScene = ScrollScrubScene & { scrim: number };

export const scrollScrubTheme: ScrollScrubTheme = {
  accent: "#ff2e14",
  background: "#070606",
  ink: "#f5efe8",
  muted: "#9a8f88",
};

/**
 * Cache key for everything under /assets/world/. These files live in public/,
 * so the build never hashes their names: re-encoding a chapter leaves the URL
 * identical and browsers (and the CDN) keep serving the old footage — which is
 * exactly how a cut ring act survived its own removal. Bump this on every
 * re-encode; it is the only thing that makes a recut reach people who have
 * already been on the page.
 */
const WORLD_VERSION = "3";

const asset = (path: string) => `${path}?v=${WORLD_VERSION}`;

const world = (name: string) => ({
  clip: asset(`/assets/world/${name}.mp4`),
  mobileClip: asset(`/assets/world/${name}-mobile.mp4`),
  mobilePoster: asset(`/assets/world/${name}-mobile-poster.jpg`),
  poster: asset(`/assets/world/${name}-poster.jpg`),
});

export const scrollScrubScenes: HecScene[] = [
  {
    // A still, not a clip: the hero opens on the world HEC happens in (night,
    // one red light, the city ahead) instead of on the logo, which now lives
    // small in the nav, the favicon and the join CTA. Still no video here, so
    // the ring never plays twice — the film starts with the meteor next door.
    id: "ignition",
    label: "Start",
    poster: asset("/assets/world/hero-poster.jpg"),
    mobilePoster: asset("/assets/world/hero-mobile-poster.jpg"),
    title: "Der Kreis für Leute, die was vorhaben.",
    body: "HEC ist eine Community in Dresden. Vier feste Termine pro Woche: Ziele, Sport, Autos, Nächte. Rein oder raus.",
    actions: <HeroCta href={WHATSAPP_URL}>{CTA_LABEL}</HeroCta>,
    align: "left",
    scroll: 1.1,
    scrim: 0.55,
  },
  {
    ...world("was-hec"),
    id: "was-hec",
    label: "HEC",
    title: "Keine Vorträge. Kein Gelaber.",
    body: "Wir reden über das, was du erreichen willst, und dann machen wir es. Jede Woche. Mit Leuten, die genauso ticken.",
    tags: ["Dresden", "High Energy Circle"],
    align: "left",
    scroll: 1.4,
    scrim: 0.7,
  },
  {
    ...world("stationen"),
    id: "wochenplan",
    label: "Woche",
    kicker: "Jede Woche",
    title: "Vier Termine. Jede Woche.",
    body: "Vier Stationen die Woche. Du entscheidest, ob du da bist.",
    actions: <AgendaLedger />,
    align: "right",
    scroll: 2.4,
    linger: 0.1,
    scrim: 1,
  },
  {
    ...world("eintritt"),
    id: "gruppe",
    label: "Gruppe",
    title: "Was in der Gruppe läuft.",
    body: "Kein Spam, keine Memes. Jeden Morgen ein GM, jede Woche ein Learning, jeder Erfolg wird gefeiert.",
    actions: (
      <>
        <ChannelReadouts />
        <OrbitLink href={WHATSAPP_URL}>{CTA_LABEL}</OrbitLink>
      </>
    ),
    align: "right",
    mobileObjectPosition: "100% 50%",
    scroll: 1.8,
    scrim: 1,
  },
  {
    // The finale, and the only chapter whose clip does not run at speed: the
    // impact beat is time-warped into slow motion and the burnt-out ring bed
    // behind it is compressed (see the impact ramp in refs/encode-chapters.sh).
    // The retime is what makes the hit land; this scroll length only buys it
    // room. Change one and re-check the other.
    //
    // The last chapter also pays a viewport: the sticky stage unsticks before
    // the band ends, so the engine scrubs this clip over scroll - 1 viewports
    // and the last one slides the finished frame away. 3.4 leaves ~2160 px of
    // scrub, ~1640 of which are the hit itself.
    ...world("einschlag"),
    id: "rein",
    label: "Rein",
    title: "Rein oder raus.",
    body: "Ein Klick, dann bist du in der Gruppe. Der nächste Termin steht drin.",
    actions: <ImpactCta href={WHATSAPP_URL}>{CTA_LABEL}</ImpactCta>,
    align: "left",
    scroll: 3.4,
    scrim: 0.85,
  },
];
