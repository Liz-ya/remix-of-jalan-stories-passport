export interface Stop {
  id: number;
  name: string;
  theme: string;
  location: string;
  description: string;
  // Position on the SVG map (percent)
  x: number;
  y: number;
}

export const STOPS: Stop[] = [
  {
    id: 1,
    name: "The Street That Fixed Everything",
    theme: "Hardware & Industrial Trades",
    location: "Jalan Besar Rd × Tyrwhitt Rd",
    description:
      "For a century, this corner supplied Singapore with bolts, brass and know-how. Every workshop here has a story bolted into its shopfront.",
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
    x: 88,
    y: 62,
  },
];

export interface DemoSlot {
  stopId: number;
  time: string; // "14:30"
  title: string;
}

// Simple hardcoded demo schedule (today)
export const DEMOS: DemoSlot[] = [
  { stopId: 1, time: "11:00", title: "Brass key-cutting demo" },
  { stopId: 2, time: "14:30", title: "Peranakan tile restoration" },
  { stopId: 3, time: "10:00", title: "Traditional coffee brewing" },
  { stopId: 3, time: "15:30", title: "Kway chap live cooking" },
  { stopId: 4, time: "13:00", title: "Sari draping workshop" },
];

export type DemoStatus =
  | { kind: "live"; demo: DemoSlot }
  | { kind: "upcoming"; demo: DemoSlot }
  | { kind: "none" };

export function getDemoStatus(stopId: number, now = new Date()): DemoStatus {
  const stopDemos = DEMOS.filter((d) => d.stopId === stopId).sort((a, b) =>
    a.time.localeCompare(b.time),
  );
  if (stopDemos.length === 0) return { kind: "none" };

  const nowMins = now.getHours() * 60 + now.getMinutes();
  for (const d of stopDemos) {
    const [h, m] = d.time.split(":").map(Number);
    const startMins = h * 60 + m;
    if (nowMins >= startMins && nowMins < startMins + 45) {
      return { kind: "live", demo: d };
    }
    if (nowMins < startMins) {
      return { kind: "upcoming", demo: d };
    }
  }
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
