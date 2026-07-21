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
    name: "Berseh Food Centre",
    theme: "Hawker food heritage",
    location: "166 Jalan Besar",
    description:
      "Berseh Food Centre is where the neighbourhood actually eats. Opened in 1985 to rehouse street hawkers who used to trade along the roadside, it now holds third-generation stalls making kway chap, chicken rice and Hokkien mee the way the grandfather made it — no queues of tourists, no reinvented menus. Several of the current stall owners started here as children, watching their parents render pork lard at 5 a.m. The recipes have not been written down; they are simply repeated. Come for breakfast, and you'll sit next to retirees who have been ordering the same plate every morning for twenty years.",
    lat: 1.30790,
    lng: 103.85760,
    x: 12,
    y: 68,
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
    id: 2,
    name: "Mustafa Mall Road",
    theme: "Textiles, henna & round-the-clock trade",
    location: "Syed Alwi Road, by Mustafa Centre",
    description:
      "Syed Alwi Road is where sari silk sits next to Malay tailors sits next to Chinese haberdashers, all selling cloth by the yard and none in the same language. Since the 1930s this stretch has been Singapore's fabric market — bolts of chiffon, brocade and cotton stacked to the ceiling, prices called out in three tongues and sealed with a nod. In 1971 a small garment shop called Mustafa opened here; it never stopped growing, and never stopped opening, becoming the 24-hour mall that now anchors the street. Bridal families still come to pick sari fabric, henna artists still work the five-foot ways, and the shopkeepers still remember which grandmother preferred which supplier.",
    lat: 1.30960,
    lng: 103.85500,
    x: 32,
    y: 40,
    facts: [
      { label: "Fabric trade since", value: "1930s" },
      { label: "Mustafa opened", value: "1971" },
    ],
    puzzle: {
      question: "What has the street outside Mustafa primarily traded in for nearly a century?",
      options: ["Spices", "Textiles and fabric", "Gold jewellery", "Timber"],
      correctIndex: 1,
      hint: "By the yard, in bolts stacked to the ceiling.",
    },
  },
  {
    id: 3,
    name: "Desker Road Shophouses",
    theme: "Shophouse life & changing communities",
    location: "Desker Road",
    description:
      "Desker Road is named after Andre Filipe Desker, a Malacca-born Eurasian who ran the largest slaughterhouse in colonial Singapore — this was the butcher's street of the 1860s, supplying the whole town with meat from the cattle yards next door. The two rows of shophouses have since lived several lives: trades, lodgings, and now the heart of Singapore's Bangladeshi community, who call the stretch the Mini Mart. Walk it slowly — behind an unmarked shopfront at No. 109, a family firm has been roasting coffee for kopitiams for over thirty years, while the street changed around it.",
    lat: 1.30935,
    lng: 103.85420,
    x: 52,
    y: 58,
    facts: [
      { label: "Named after", value: "A. F. Desker, 1860s" },
      { label: "Today", value: "Little Bangladesh" },
    ],
    puzzle: {
      question: "Desker Road takes its name from Andre Filipe Desker. What business made him famous?",
      options: [
        "Textile weaving",
        "Butchery and slaughterhouses",
        "Goldsmithing",
        "Shipping and trade",
      ],
      correctIndex: 1,
      hint: "This was the butcher's street — think of the cattle yards next door.",
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
  {
    id: 4,
    name: "New World Gate, City Square Mall",
    theme: "Amusement park heritage",
    location: "City Square Mall, Kitchener Road",
    description:
      "The ornate gate standing outside City Square Mall once welcomed thousands a night into New World Amusement Park — the first of Singapore's three great \"Worlds\", opened in 1923 between Jalan Besar and Kitchener Road. Inside were cabaret dancers, bangsawan opera, boxing and wrestling matches, shooting galleries and open-air cinema; the Shaw brothers ran it from 1938 and made it the island's playground for half a century. The park closed in 1987 and the mall rose in its place, but the entrance gate was restored and re-erected where you now stand — the last piece of the fairground still on its street.",
    lat: 1.31130,
    lng: 103.85630,
    x: 72,
    y: 34,
    facts: [
      { label: "Park opened", value: "1923" },
      { label: "Gate restored", value: "2009" },
    ],
    puzzle: {
      question: "The historic gate outside City Square Mall once welcomed visitors to what?",
      options: [
        "A colonial railway station",
        "New World Amusement Park",
        "A cattle market",
        "A cinema hall",
      ],
      correctIndex: 1,
      hint: "Cabaret, opera and boxing nights — Singapore's first great \"World\".",
    },
    highlights: {
      heading: "New World Gate",
      subheading: "Singapore's playground, 1923–1987",
      blocks: [
        { title: "1923 — The park opens", body: "New World Amusement Park opened between Jalan Besar and Kitchener Road — the first of Singapore's three great \"Worlds\", decades before shopping malls existed." },
        { title: "The golden decades", body: "Cabaret dancers, bangsawan opera, boxing and wrestling matches drew thousands nightly. The Shaw brothers ran the park from 1938." },
        { title: "The gate today", body: "The park closed in 1987, but its ornate entrance gate was restored and now stands at City Square Mall — the spot where you're standing." },
      ],
    },
  },
  {
    id: 5,
    name: "Lembu Road Open Space",
    theme: "Cattle district & community life",
    location: "Lembu Road, off Jalan Besar",
    description:
      "\"Lembu\" means cattle in Malay, and the name is no accident — from the 1850s this was Singapore's cattle district, where traders from Calcutta ran cattle yards and dairies that fed the whole island. The herds are long gone, but the street names remember them: Lembu (cattle), Kerbau (buffalo), Desker (the butcher). Today the open space has a different kind of life — on Sundays it fills with the area's Bangladeshi and Indian migrant workers, meeting friends, sharing food and calling home. It is still what it has always been: the neighbourhood's common ground.",
    lat: 1.30880,
    lng: 103.85560,
    x: 88,
    y: 62,
    facts: [
      { label: "\"Lembu\" means", value: "Cattle (Malay)" },
      { label: "Cattle trade", value: "1850s–1920s" },
    ],
    puzzle: {
      question: "What does \"Lembu\" — the road this open space sits on — mean in Malay?",
      options: ["Rice", "Cattle", "River", "Market"],
      correctIndex: 1,
      hint: "The district once supplied the whole island with beef and milk.",
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
  { id: "d1", stopId: 1, title: "Live food preparation by local hawkers", vendor: "Berseh Food Centre hawkers", start: "10:00", end: "11:30" },
  { id: "d2", stopId: 2, title: "Henna art demonstrations", vendor: "Syed Alwi henna artists", start: "12:00", end: "13:00" },
  { id: "d3", stopId: 3, title: "Shophouse heritage walk", vendor: "Desker Road community guides", start: "14:00", end: "16:00" },
  { id: "d4", stopId: 4, title: "New World stories showcase", vendor: "City Square Mall heritage corner", start: "15:30", end: "16:30" },
  { id: "d5", stopId: 5, title: "Community cultural performance", vendor: "Lembu Road community groups", start: "17:00", end: "18:00" },
  {
    id: "d-sinhin",
    stopId: 3,
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
  { id: "desker-01", business: "Desker Road Hardware", offer: "Free engraved key tag", code: "JALAN-BRASS", requiredStops: 4 },
  { id: "world-01", business: "City Square Mall", offer: "$5 heritage trail voucher", code: "JALAN-WORLD", requiredStops: 5 },
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
