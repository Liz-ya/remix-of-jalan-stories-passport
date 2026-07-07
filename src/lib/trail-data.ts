export interface Stop {
  id: number;
  name: string;
  theme: string;
  location: string;
  description: string;
  lat: number;
  lng: number;
  // Legacy percent coords (kept for any decorative SVG use)
  x: number;
  y: number;
}

export const MAP_CENTER: [number, number] = [1.3127, 103.8567];
export const MAP_ZOOM = 16;

export const STOPS: Stop[] = [
  {
    id: 1,
    name: "The Street That Fixed Everything",
    theme: "Hardware & Industrial Trades",
    location: "Jalan Besar Rd × Tyrwhitt Rd",
    description:
      "For a century, this corner supplied Singapore with bolts, brass and know-how. Every workshop here has a story bolted into its shopfront.",
    lat: 1.3134,
    lng: 103.8611,
    x: 12,
    y: 68,
  },
  {
    id: 2,
    name: "Shophouse Chronicles",
    theme: "Peranakan Shophouse Architecture",
    location: "Petain Road",
    description:
      "A pastel parade of Rococo façades — considered among the most ornate shophouses in Singapore. Each tile was a family's calling card.",
    lat: 1.3158,
    lng: 103.8590,
    x: 32,
    y: 40,
  },
  {
    id: 3,
    name: "Flavours of the Quarter",
    theme: "Hawker Food Heritage",
    location: "Berseh Food Centre",
    description:
      "Where third-generation hawkers still ladle out kway chap, tau huay and coffee ground to order. The neighbourhood's living kitchen.",
    lat: 1.3106,
    lng: 103.8570,
    x: 52,
    y: 58,
  },
  {
    id: 4,
    name: "Cloth, Colour & Community",
    theme: "Textile & Multicultural Trade",
    location: "Syed Alwi Road",
    description:
      "Bolts of sari silk, Tamil music, Malay tailoring, Chinese haberdashery — a street where every language is measured in yards.",
    lat: 1.3095,
    lng: 103.8583,
    x: 72,
    y: 34,
  },
  {
    id: 5,
    name: "The Stadium and the Street",
    theme: "Sports & Civic Identity",
    location: "Jalan Besar Stadium",
    description:
      "The blue-collared cathedral of Singapore football. From the Malaya Cup to today's Lions, roars from these stands shaped a nation.",
    lat: 1.3115,
    lng: 103.8631,
    x: 88,
    y: 62,
  },
];

export interface DemoSlot {
  id: string;
  stopId: number;
  title: string;
  vendor: string;
  /** "HH:MM" 24h Singapore local time */
  start: string;
  end: string;
}

export const DEMOS: DemoSlot[] = [
  { id: "d1", stopId: 1, title: "Batik Printing", vendor: "Warisan Batik House", start: "10:00", end: "11:30" },
  { id: "d2", stopId: 3, title: "Claypot Craft", vendor: "Sin Heng Claypot", start: "12:00", end: "13:00" },
  { id: "d3", stopId: 4, title: "Traditional Block Printing", vendor: "Textile Heritage Centre", start: "14:00", end: "16:00" },
  { id: "d4", stopId: 2, title: "Roti Making", vendor: "Bakers of Jalan Besar", start: "15:30", end: "16:30" },
  { id: "d5", stopId: 1, title: "Hardware Craft", vendor: "Jalan Besar Hardware Co.", start: "17:00", end: "18:00" },
];

export type DemoState = "live" | "soon" | "upcoming" | "ended";

export interface DemoStatusInfo {
  state: DemoState;
  startAt: Date;
  endAt: Date;
  msToStart: number;
  msToEnd: number;
}

/** Interpret a HH:MM as Singapore local (UTC+8) time for TODAY. */
function sgTimeToday(hhmm: string, now = new Date()): Date {
  const [h, m] = hhmm.split(":").map(Number);
  // Compute UTC ms for today's H:M in SGT (UTC+8)
  const nowSg = new Date(now.getTime() + 8 * 3600 * 1000);
  const y = nowSg.getUTCFullYear();
  const mo = nowSg.getUTCMonth();
  const d = nowSg.getUTCDate();
  return new Date(Date.UTC(y, mo, d, h - 8, m, 0));
}

export function getDemoStatusInfo(demo: DemoSlot, now = new Date()): DemoStatusInfo {
  const startAt = sgTimeToday(demo.start, now);
  const endAt = sgTimeToday(demo.end, now);
  const msToStart = startAt.getTime() - now.getTime();
  const msToEnd = endAt.getTime() - now.getTime();
  let state: DemoState;
  if (msToEnd <= 0) state = "ended";
  else if (msToStart <= 0) state = "live";
  else if (msToStart <= 30 * 60 * 1000) state = "soon";
  else state = "upcoming";
  return { state, startAt, endAt, msToStart, msToEnd };
}

export function sortedDemos(now = new Date()): Array<DemoSlot & { info: DemoStatusInfo }> {
  const order: Record<DemoState, number> = { live: 0, soon: 1, upcoming: 2, ended: 3 };
  return DEMOS.map((d) => ({ ...d, info: getDemoStatusInfo(d, now) })).sort((a, b) => {
    const s = order[a.info.state] - order[b.info.state];
    if (s !== 0) return s;
    return a.info.startAt.getTime() - b.info.startAt.getTime();
  });
}

/** Legacy helper used by trail sidebar. */
export type DemoStatus =
  | { kind: "live"; demo: DemoSlot }
  | { kind: "upcoming"; demo: DemoSlot }
  | { kind: "none" };

export function getDemoStatus(stopId: number, now = new Date()): DemoStatus {
  const list = DEMOS.filter((d) => d.stopId === stopId)
    .map((d) => ({ d, info: getDemoStatusInfo(d, now) }));
  const live = list.find((x) => x.info.state === "live");
  if (live) return { kind: "live", demo: live.d };
  const upcoming = list
    .filter((x) => x.info.state === "upcoming" || x.info.state === "soon")
    .sort((a, b) => a.info.msToStart - b.info.msToStart)[0];
  if (upcoming) return { kind: "upcoming", demo: upcoming.d };
  return { kind: "none" };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

export const BADGES: Badge[] = [
  { id: "first-step", name: "First Step", description: "Visited your first stop", emoji: "👣" },
  { id: "trail-blazer", name: "Trail Blazer", description: "Discovered all 5 stops", emoji: "🔥" },
  { id: "craft-witness", name: "Craft Witness", description: "Attended a live demo", emoji: "🛠️" },
  { id: "story-keeper", name: "Story Keeper", description: "Completed all puzzles", emoji: "📜" },
  { id: "jalan-champion", name: "Jalan Champion", description: "Full trail completion", emoji: "🏆" },
];

export interface Reward {
  id: string;
  business: string;
  offer: string;
  code: string;
  requiredStops: number;
}

export const REWARDS: Reward[] = [
  { id: "kopi-01", business: "Berseh Kopi Uncle", offer: "1-for-1 kopi + kaya toast", code: "JALAN-KOPI", requiredStops: 1 },
  { id: "textile-01", business: "Syed Alwi Textile Co.", offer: "15% off any fabric", code: "JALAN-CLOTH", requiredStops: 3 },
  { id: "brass-01", business: "Tyrwhitt Hardware", offer: "Free engraved key tag", code: "JALAN-BRASS", requiredStops: 4 },
  { id: "stadium-01", business: "Jalan Besar FC Shop", offer: "20% off merch", code: "JALAN-LIONS", requiredStops: 5 },
];

export function computeBadges(visitedStopIds: number[]): string[] {
  const earned: string[] = [];
  if (visitedStopIds.length >= 1) earned.push("first-step");
  if (visitedStopIds.length >= 5) {
    earned.push("trail-blazer", "story-keeper", "jalan-champion");
  }
  return earned;
}

export function unlockedRewardIds(visitedStopIds: number[]): string[] {
  return REWARDS.filter((r) => visitedStopIds.length >= r.requiredStops).map((r) => r.id);
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return "0s";
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  const s = Math.floor((ms % 60000) / 1000);
  if (h > 0) return `${h}h ${m}m`;
  if (totalMin >= 1) return `${m}m`;
  return `${s}s`;
}

export function formatCountdownSeconds(ms: number): string {
  if (ms <= 0) return "0s";
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (m >= 1) return `${m}m ${s}s`;
  return `${s}s`;
}

export function formatTimeRange(start: string, end: string): string {
  const fmt = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const h12 = ((h + 11) % 12) + 1;
    return `${h12}:${m.toString().padStart(2, "0")}${period}`;
  };
  return `${fmt(start)} – ${fmt(end)}`;
}
