export interface HighlightBlock {
  title: string;
  body: string;
}

export interface StopHighlights {
  heading: string;
  subheading: string;
  blocks: HighlightBlock[];
  footer?: { text: string; linkDemoId?: string };
}

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
  highlights?: StopHighlights;
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
      "If something in Singapore broke in the last hundred years, someone probably came here to fix it. The shops still sell bolts by weight and advice for free.",
    lat: 1.307381,
    lng: 103.856897,
    x: 12,
    y: 68,
  },
  {
    id: 2,
    name: "Shophouse Chronicles",
    theme: "Peranakan Shophouse Architecture",
    location: "Petain Road",
    description:
      "The most over-decorated shophouses in Singapore, and proudly so. Every tile on these walls was a family showing off. Stand across the road and count the colours.",
    lat: 1.309431,
    lng: 103.855739,
    x: 32,
    y: 40,
  },
  {
    id: 3,
    name: "Flavours of the Quarter",
    theme: "Hawker Food Heritage",
    location: "Berseh Food Centre",
    description:
      "Third-generation stalls, no queues of tourists, kway chap the way the grandfather made it. This is where the neighbourhood actually eats.",
    lat: 1.308203,
    lng: 103.856436,
    x: 52,
    y: 58,
  },
  {
    id: 4,
    name: "Cloth, Colour & Community",
    theme: "Textile & Multicultural Trade",
    location: "Syed Alwi Road",
    description:
      "Sari silk next to Malay tailors next to Chinese haberdashers, all selling cloth by the yard and none in the same language. It works anyway. It has for a century.",
    lat: 1.311825,
    lng: 103.855653,
    x: 72,
    y: 34,
  },
  {
    id: 5,
    name: "Desker Road",
    theme: "Five lives of one street",
    location: "Desker Road",
    description:
      "Named for a colonial-era butcher, remembered for its cattle yards and back-lane years, and still the beating heart of Little Bangladesh. And at No. 109, coffee has been roasting through it all.",
    lat: 1.309403,
    lng: 103.854767,
    x: 88,
    y: 62,
    highlights: {
      heading: "Desker Road",
      subheading: "Five lives of one street",
      blocks: [
        {
          title: "1860s — The butcher's street",
          body: "Named after Andre Filipe Desker, a Malacca-born Eurasian who ran the largest slaughterhouse in colonial Singapore. His ad in The Straits Times, June 1865, promised \"a regular supply of the best mutton.\" His sheep came from Australia and lived in pens where these shophouses now stand.",
        },
        {
          title: "The cattle years",
          body: "Grass and water made this area Singapore's cattle district from the 1850s. The street names still say so — Lembu Road next door means \"cattle\" in Malay. Buffalo Road and Kerbau Road are a short walk away.",
        },
        {
          title: "After the war",
          body: "Desker Road's back lanes became one of Singapore's most talked-about red-light areas. Older Singaporeans still lower their voices at the street's name.",
        },
        {
          title: "1991 — Conserved",
          body: "URA added Desker Road's shophouses to the Little India conservation area. The paint is protected. So, in theory, is everything the street remembers.",
        },
        {
          title: "Today — Little Bangladesh",
          body: "The stretch near Serangoon Road is the heart of Singapore's Bangladeshi community, who call it the Mini Mart. On Sundays, Bangladesh Square — the corner of Desker and Lembu, the exact site of the old cattle yards — fills with people, biryani and paan.",
        },
      ],
      footer: {
        text: "And at No. 109, behind an unmarked shopfront, coffee has been roasting through it all.",
        linkDemoId: "d-sinhin",
      },
    },
  },
];


export interface DemoSlot {
  id: string;
  stopId: number;
  title: string;
  vendor: string;
  location?: string;
  /** "HH:MM" 24h Singapore local time */
  start: string;
  end: string;
  detail?: {
    heading: string;
    subheading: string;
    body: string;
    rows?: Array<{ label: string; value: string }>;
  };
}

export const DEMOS: DemoSlot[] = [
  { id: "d1", stopId: 1, title: "Batik Printing", vendor: "Warisan Batik House", start: "10:00", end: "11:30" },
  { id: "d2", stopId: 3, title: "Claypot Craft", vendor: "Sin Heng Claypot", start: "12:00", end: "13:00" },
  { id: "d3", stopId: 4, title: "Traditional Block Printing", vendor: "Textile Heritage Centre", start: "14:00", end: "16:00" },
  { id: "d4", stopId: 2, title: "Roti Making", vendor: "Bakers of Jalan Besar", start: "15:30", end: "16:30" },
  { id: "d5", stopId: 1, title: "Hardware Craft", vendor: "Jalan Besar Hardware Co.", start: "17:00", end: "18:00" },
  {
    id: "d-sinhin",
    stopId: 5,
    title: "Traditional Coffee Roasting",
    vendor: "Sin Hin & Co.",
    location: "109 Desker Road",
    start: "08:30",
    end: "16:30",
    detail: {
      heading: "Sin Hin & Co.",
      subheading: "Traditional coffee roasting · 109 Desker Road",
      body:
        "There's no sign worth noticing at No. 109. That's the point — Sin Hin sells to kopitiams, not to you. For over thirty years, this family firm has processed coffee beans on Desker Road, weekday mornings, weekends off, while the street changed around it.\n\nThey roast the Nanyang way: robusta beans, high heat, and — this is the part that surprises people — sugar and margarine thrown in with the beans. The sugar caramelises onto every bean and welds the batch into a solid block, which then has to be broken apart by hand with metal rods. That caramel crust is why kopi tastes nothing like café coffee: darker, thicker, with a burnt-butterscotch edge. It's a 19th-century workaround that became a national taste.\n\nRoasters like this used to be everywhere. Most are gone. Almost none let the public watch.",
      rows: [
        { label: "When to visit", value: "Mon–Fri, 8:30am–4:30pm (closed weekends)" },
        { label: "What you'll see", value: "green beans going in, a caramelised block coming out, and the rods that break it" },
        { label: "What you'll smell", value: "you'll know it from two shops away" },
      ],
    },
  },
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
