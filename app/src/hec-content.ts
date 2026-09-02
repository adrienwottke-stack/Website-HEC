/**
 * Single source of truth for everything editable on the HEC landing page:
 * links, schedule, channels, reels, legal data, metadata. No JSX in here.
 */

/** Public origin of the site (canonical, og:url, JSON-LD). Set VITE_SITE_URL in
 * the hosting environment (Vercel: Project Settings > Environment Variables). */
const SITE_URL_ENV = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim();
export const SITE_URL = (SITE_URL_ENV || "https://website-hec.vercel.app").replace(
  /\/+$/,
  "",
);
export const SITE_NAME = "HEC";
export const SITE_TITLE = "HEC. High Energy Circle Dresden";
export const SITE_DESCRIPTION =
  "High Energy Circle: Community in Dresden mit vier festen Terminen pro Woche. Ziele, Sport, Autos, Nächte. Rein über WhatsApp.";
export const THEME_COLOR = "#070606";

/** The one CTA label on the whole page (one label per intent). */
export const CTA_LABEL = "Zur WhatsApp-Gruppe";

/** WhatsApp invite link of the HEC group. */
export const WHATSAPP_URL = "https://chat.whatsapp.com/FH8rNBEqze3Ix5dwX9OWdv";

/** Instagram profile URL. Leave empty to hide the footer link. */
export const INSTAGRAM_URL = "";

/** Glyphs from the generated icon set under /assets/icons/. */
export type IconName = "bolt" | "ring" | "dumbbell" | "car" | "sunrise" | "bubble";

export interface ScheduleRow {
  day: string;
  time: string;
  name: string;
  text: string;
  icon: IconName;
}

export const SCHEDULE: ScheduleRow[] = [
  {
    day: "DI",
    time: "19:00",
    name: "Power Meeting",
    text: "Energiekreis, Autos, Talk über Ziele und Motivation.",
    icon: "bolt",
  },
  {
    day: "MI",
    time: "abends",
    name: "Sport + Vision Talk",
    text: "Erst Training, dann reden wir über deine Ziele.",
    icon: "dumbbell",
  },
  {
    day: "FR",
    time: "abends",
    name: "Freizeit",
    text: "Club, Treffen, Auto, Bar. Jede Woche was anderes.",
    icon: "car",
  },
  {
    day: "SO",
    time: "nachmittags",
    name: "Vision Walk",
    text: "Wochenrückblick. Was lief, was nicht, was kommt.",
    icon: "sunrise",
  },
];

export interface ChannelReadout {
  label: string;
  text: string;
  icon: IconName;
}

export const CHANNELS: ChannelReadout[] = [
  { label: "GM", text: "jeden Morgen", icon: "sunrise" },
  { label: "Wins", text: "deine Erfolge", icon: "bolt" },
  { label: "Learning", text: "der Woche", icon: "bubble" },
  { label: "Vision", text: "dein Ziel, dein Weg", icon: "ring" },
  { label: "Termine", text: "Orte und Zeiten der Woche", icon: "car" },
];

export interface Reel {
  /** Full instagram.com/reel/... URL. */
  url: string;
  /** Short caption shown on the tile and used as the accessible name. */
  caption: string;
  /** Optional poster image under /assets/reels/. */
  poster?: string;
}

/** Reels from the meetups. Empty array hides the section entirely. */
export const REELS: Reel[] = [];

/** Legal data for /impressum and /datenschutz. INPUT_PENDING until provided. */
export const LEGAL = {
  name: "INPUT_PENDING",
  street: "INPUT_PENDING",
  city: "INPUT_PENDING",
  email: "INPUT_PENDING",
};
