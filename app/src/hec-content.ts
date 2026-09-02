/**
 * Single source of truth for everything editable on the HEC landing page:
 * links, schedule, channels, reels, legal data, metadata. No JSX in here.
 */

export const SITE_URL = "https://high-energy-circle.higgsfield.app";
export const SITE_NAME = "HEC";
export const SITE_TITLE = "HEC. High Energy Circle Dresden";
export const SITE_DESCRIPTION =
  "High Energy Circle: Studenten-Community in Dresden mit vier festen Terminen pro Woche. Ziele, Sport, Autos, Nächte. Rein über WhatsApp.";
export const THEME_COLOR = "#070606";

/** The one CTA label on the whole page (one label per intent). */
export const CTA_LABEL = "Zur WhatsApp-Gruppe";

/** WhatsApp invite link of the HEC group. INPUT_PENDING until Adrien sends it. */
export const WHATSAPP_URL = "https://chat.whatsapp.com/INPUT_PENDING";

/** Instagram profile URL. Leave empty to hide the footer link. */
export const INSTAGRAM_URL = "";

export interface ScheduleRow {
  day: string;
  time: string;
  name: string;
  text: string;
}

export const SCHEDULE: ScheduleRow[] = [
  {
    day: "DI",
    time: "19:00",
    name: "Power Meeting",
    text: "Energiekreis, Autos, Talk über Ziele und Motivation.",
  },
  {
    day: "MI",
    time: "abends",
    name: "Sport + Vision Talk",
    text: "Erst Training, dann reden wir über deine Ziele.",
  },
  {
    day: "FR",
    time: "abends",
    name: "Freizeit",
    text: "Club, Treffen, Auto, Bar. Jede Woche was anderes.",
  },
  {
    day: "SO",
    time: "nachmittags",
    name: "Vision Walk",
    text: "Wochenrückblick. Was lief, was nicht, was kommt.",
  },
];

export interface ChannelReadout {
  label: string;
  text: string;
}

export const CHANNELS: ChannelReadout[] = [
  { label: "GM", text: "jeden Morgen" },
  { label: "Wins", text: "deine Erfolge" },
  { label: "Learning", text: "der Woche" },
  { label: "Vision", text: "dein Ziel, dein Weg" },
  { label: "Termine", text: "Orte und Zeiten der Woche" },
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
