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

export interface PuzzleQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
}

export interface Stop {
  id: number;
  name: string;
  theme: string;
  location: string;
  description: string;
  lat: number;
  lng: number;
  x: number;
  y: number;
  facts?: Array<{ label: string; value: string }>;
  puzzle: PuzzleQuestion;
  highlights?: StopHighlights;
}

export const STOPS: Stop[] = [
  {
    id: 1,
    name: "The Street That Fixed Everything",
    theme: "Hardware & industrial trades",
    location: "Desker Road / Jalan Besar Rd junction",
    description:
      "If something in Singapore broke in the last hundred years, someone probably came here to fix it. From the early 1900s, Jalan Besar's shophouses filled with hardware traders, ironmongers and mechanics selling bolts by weight and advice for free. Whole industries depended on this stretch — kitchen fitters, boat repairers, kopitiam owners with a busted stove. Today, the same shopfronts still hum with grinders and welding sparks, run mostly by second- and third-generation families who inherited both the trade and the tools. It is one of the last unbroken industrial streets in the city.",
    lat: 1.3145,
    lng: 103.8578,
    x: 12,
    y: 68,
    facts: [
      { label: "Est.", value: "Early 1900s" },
      { label: "Trade shops", value: "Over 40 still active" },
    ],
    puzzle: {
      question: "What are the shophouses along this stretch of Jalan Besar most historically known for?",
      options: [
        "Textile and tailoring",
        "Hardware and industrial trades",
        "Traditional medicine",
        "Printing and bookbinding",
      ],
      correctIndex: 1,
      hint: "Think of bolts, tools and welding sparks — the trade you'd come here to buy or fix.",
    },
  },
  {
    id: 2,
    name: "Shophouse Chronicles",
    theme: "Peranakan shophouse architecture",
    location: "Tyrwhitt Road",
    description:
      "The shophouses on Tyrwhitt Road are among the most decorated in Singapore, and proudly so. Built in the late 1920s and 1930s by wealthy Peranakan families, each façade was a family showing off — hand-painted tiles imported from England, plaster cornices modelled on European villas, and pastel colours that changed by the year. Every ornament told the street who lived there and how well they'd done. The buildings survived the war, urban renewal and multiple owners because URA folded them into a conservation area in 1991. Stand across the road and count the colours: no two adjoining houses match.",
    lat: 1.3135,
    lng: 103.8570,
    x: 32,
    y: 40,
    facts: [
      { label: "Built", value: "1920s–1930s" },
      { label: "Style", value: "Late Peranakan / Art Deco" },
    ],
    puzzle: {
      question: "The elaborate façades of Tyrwhitt Road's shophouses were mostly built by which community?",
      options: ["Colonial British administrators", "Peranakan (Straits Chinese) families", "Tamil merchants", "Bugis traders"],
      correctIndex: 1,
      hint: "This community was famous for imported tiles and mixing Chinese, Malay and European design.",
    },
  },
  {
    id: 3,
    name: "Flavours of the Quarter",
    theme: "Hawker food heritage",
    location: "Berseh Food Centre",
    description:
      "Berseh Food Centre is where the neighbourhood actually eats. Opened in 1985 to rehouse street hawkers who used to trade along the roadside, it now holds third-generation stalls making kway chap, chicken rice and Hokkien mee the way the grandfather made it — no queues of tourists, no reinvented menus. Several of the current stall owners started here as children, watching their parents render pork lard at 5 a.m. The recipes have not been written down; they are simply repeated. Come for breakfast, and you'll sit next to retirees who have been ordering the same plate every morning for twenty years.",
    lat: 1.3120,
    lng: 103.8562,
    x: 52,
    y: 58,
    facts: [
      { label: "Opened", value: "1985" },
      { label: "Original stalls", value: "Some 3rd generation" },
    ],
    puzzle: {
      question: "Berseh Food Centre was built in the 1980s to rehouse whom?",
      options: [
        "Wet-market fishmongers",
        "Roadside street hawkers",
        "Bakery owners displaced by fire",
        "Cattle traders",
      ],
      correctIndex: 1,
      hint: "Before the building went up, these vendors traded in the open along the road.",
    },
  },
  {
    id: 4,
    name: "Cloth, Colour & Community",
    theme: "Textile and multicultural trade",
    location: "Syed Alwi Road",
    description:
      "Syed Alwi Road is where sari silk sits next to Malay tailors sits next to Chinese haberdashers, all selling cloth by the yard and none in the same language. Since the 1930s this stretch has been Singapore's fabric market — bolts of chiffon, brocade and cotton stacked to the ceiling, prices called out in three tongues and sealed with a nod. It works anyway. It has for a century. Bridal families still come here to pick sari fabric; costume makers still come for stage silks; and the shopkeepers still remember which grandmother preferred which supplier.",
    lat: 1.3108,
    lng: 103.8555,
    x: 72,
    y: 34,
    facts: [
      { label: "Fabric trade since", value: "1930s" },
      { label: "Languages traded in", value: "3 or more" },
    ],
    puzzle: {
      question: "What has Syed Alwi Road primarily traded in for nearly a century?",
      options: ["Spices", "Textiles and fabric", "Gold jewellery", "Timber"],
      correctIndex: 1,
      hint: "By the yard, in bolts stacked to the ceiling.",
    },
  },
  {
    id: 5,
    name: "The Stadium and the Street",
    theme: "Sports, civic identity, community",
    location: "Jalan Besar Stadium",
    description:
      "Jalan Besar Stadium has been the neighbourhood's living room since 1929. It is where the Lions won their first Malaya Cups, where kampung boys tried out for national squads, and where the community still gathers on match nights with kopi and kacang. Rebuilt in 1999 and again refurbished for the SEA Games, the stadium anchors the southern end of the trail and gives Jalan Besar a civic identity most Singapore neighbourhoods lost decades ago. Walk past on a match evening and you'll hear the crowd two streets away — the same sound residents have heard for nearly a hundred years.",
    lat: 1.3093,
    lng: 103.8550,
    x: 88,
    y: 62,
    facts: [
      { label: "Opened", value: "1929" },
      { label: "Home of", value: "Singapore football" },
    ],
    puzzle: {
      question: "Jalan Besar Stadium has served as the historic home of which sport in Singapore?",
      options: ["Cricket", "Rugby", "Football", "Field hockey"],
      correctIndex: 2,
      hint: "The Lions and the Malaya Cup are the clues.",
    },
    highlights: {
      heading: "Desker Road",
      subheading: "Five lives of one street",
      blocks: [
        { title: "1860s — The butcher's street", body: "Named after Andre Filipe Desker, a Malacca-born Eurasian who ran the largest slaughterhouse in colonial Singapore." },
        { title: "The cattle years", body: "Grass and water made this area Singapore's cattle district from the 1850s. Lembu Road next door means \"cattle\" in Malay." },
        { title: "Today — Little Bangladesh", body: "The stretch is now the heart of Singapore's Bangladeshi community, who call it the Mini Mart." },
      ],
      footer: { text: "And at No. 109, behind an unmarked shopfront, coffee has been roasting through it all.", linkDemoId: "d-sinhin" },
    },
  },
];


export interface DemoSlot {
  id: string;
  stopId: number;
  title: string;
  vendor: string;
  location?: string;
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
  { id: "d1", stopId: 1, title: "Hardware Craft", vendor: "Jalan Besar Hardware Co.", start: "10:00", end: "11:30" },
  { id: "d2", stopId: 3, title: "Claypot Craft", vendor: "Sin Heng Claypot", start: "12:00", end: "13:00" },
  { id: "d3", stopId: 4, title: "Traditional Block Printing", vendor: "Textile Heritage Centre", start: "14:00", end: "16:00" },
  { id: "d4", stopId: 2, title: "Roti Making", vendor: "Bakers of Jalan Besar", start: "15:30", end: "16:30" },
  { id: "d5", stopId: 5, title: "Stadium Tour", vendor: "Jalan Besar FC", start: "17:00", end: "18:00" },
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
        "There's no sign worth noticing at No. 109. That's the point — Sin Hin sells to kopitiams, not to you. For over thirty years, this family firm has processed coffee beans on Desker Road, weekday mornings, weekends off, while the street changed around it.",
      rows: [
        { label: "When to visit", value: "Mon–Fri, 8:30am–4:30pm" },
        { label: "What you'll see", value: "green beans going in, a caramelised block coming out" },
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

export type DemoStatus =
  | { kind: "live"; demo: DemoSlot }
  | { kind: "upcoming"; demo: DemoSlot }
  | { kind: "none" };

export function getDemoStatus(stopId: number, now = new Date()): DemoStatus {
  const list = DEMOS.filter((d) => d.stopId === stopId).map((d) => ({ d, info: getDemoStatusInfo(d, now) }));
  const live = list.find((x) => x.info.state === "live");
  if (live) return { kind: "live", demo: live.d };
  const upcoming = list
    .filter((x) => x.info.state === "upcoming" || x.info.state === "soon")
    .sort((a, b) => a.info.msToStart - b.info.msToStart)[0];
  if (upcoming) return { kind: "upcoming", demo: upcoming.d };
  return { kind: "none" };
}

/** Active or next demo (live/soon/upcoming) at this stop today. */
export function getActiveOrUpcomingDemo(stopId: number, now = new Date()): (DemoSlot & { info: DemoStatusInfo }) | null {
  const list = DEMOS.filter((d) => d.stopId === stopId)
    .map((d) => ({ ...d, info: getDemoStatusInfo(d, now) }))
    .filter((d) => d.info.state !== "ended")
    .sort((a, b) => a.info.msToStart - b.info.msToStart);
  return list[0] ?? null;
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
  if (visitedStopIds.length >= 5) earned.push("trail-blazer", "story-keeper", "jalan-champion");
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

/** Straight-line distance × 1.3 street factor, in metres. */
export function walkingDistanceMeters(a: Stop, b: Stop): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  const straight = 2 * R * Math.asin(Math.sqrt(s));
  return straight * 1.3;
}

/** Approximate walking minutes (80 m/min pace). */
export function walkingMinutes(a: Stop, b: Stop): number {
  return Math.max(1, Math.round(walkingDistanceMeters(a, b) / 80));
}

export function getNextStop(stopId: number): Stop | null {
  const idx = STOPS.findIndex((s) => s.id === stopId);
  if (idx < 0 || idx >= STOPS.length - 1) return null;
  return STOPS[idx + 1];
}
