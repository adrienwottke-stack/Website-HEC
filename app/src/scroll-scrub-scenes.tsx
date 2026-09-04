/**
 * Scene data for the HEC journey: one seam-locked film chain (the ring, the
 * meteor flight past four stations, the atmosphere entry, the impact), cut
 * into five chapter segments. Every poster is the exact first frame of the
 * encoded clip beside it. Keep this array a module constant: changing its
 * identity rebuilds the media controller.
 */
import type {
  ScrollScrubScene,
  ScrollScrubTheme,
} from "@/components/scroll-scrub/scroll-scrub";
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

const world = (name: string) => ({
  clip: `/assets/world/${name}.mp4`,
  mobileClip: `/assets/world/${name}-mobile.mp4`,
  mobilePoster: `/assets/world/${name}-mobile-poster.jpg`,
  poster: `/assets/world/${name}-poster.jpg`,
});

export const scrollScrubScenes: HecScene[] = [
  {
    ...world("ignition"),
    id: "ignition",
    label: "Start",
    title: "Der Kreis für Leute, die was vorhaben.",
    body: "HEC ist eine Community in Dresden. Vier feste Termine pro Woche: Ziele, Sport, Autos, Nächte. Rein oder raus.",
    actions: <HeroCta href={WHATSAPP_URL}>{CTA_LABEL}</HeroCta>,
    align: "left",
    scroll: 1.5,
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
    ...world("einschlag"),
    id: "rein",
    label: "Rein",
    title: "Rein oder raus.",
    body: "Ein Klick, dann bist du in der Gruppe. Der nächste Termin steht drin.",
    actions: <ImpactCta href={WHATSAPP_URL}>{CTA_LABEL}</ImpactCta>,
    align: "left",
    scroll: 2.0,
    scrim: 0.85,
  },
];
