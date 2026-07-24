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

export interface StopImage {
  src: string;
  alt: string;
  credit: string;
  creditUrl: string;
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
  image?: StopImage;
  puzzle: PuzzleQuestion;
  highlights?: StopHighlights;
}

// Freely licensed location photos, hotlinked from Wikimedia Commons.
// Special:FilePath serves a resized copy and redirects to the file CDN.
function commonsImage(file: string, alt: string): StopImage {
  return {
    src: `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=1200`,
    alt,
    credit: "Wikimedia Commons",
    creditUrl: `https://commons.wikimedia.org/wiki/File:${file}`,
  };
}

export const STOPS: Stop[] = [
  {
    id: 1,
    name: "Berseh Food Centre",
    theme: "Hawker food heritage",
    location: "166 Jalan Besar",
    description:
      "Berseh Food Centre is where the neighbourhood actually eats. Opened in 1985 to rehouse street hawkers who used to trade along the roadside, it now holds third-generation stalls making kway chap, chicken rice and Hokkien mee the way the grandfather made it — no queues of tourists, no reinvented menus. Several of the current stall owners started here as children, watching their parents render pork lard at 5 a.m. The recipes have not been written down; they are simply repeated. Come for breakfast, and you'll sit next to retirees who have been ordering the same plate every morning for twenty years.",
    lat: 1.307381,
    lng: 103.856897,
    x: 12,
    y: 68,
    facts: [
      { label: "Opened", value: "1985" },
      { label: "Original stalls", value: "Some 3rd generation" },
    ],
    image: commonsImage(
      "Jalan_Besar.JPG",
      "Shophouses along Jalan Besar, home of Berseh Food Centre",
    ),
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
    name: "Desker Road Shophouses",
    theme: "Shophouse life & changing communities",
    location: "Desker Road",
    description:
      "Desker Road is named after Andre Filipe Desker, a Malacca-born Eurasian who ran the largest slaughterhouse in colonial Singapore — this was the butcher's street of the 1860s, supplying the whole town with meat from the cattle yards next door. The two rows of shophouses have since lived several lives: trades, lodgings, and now the heart of Singapore's Bangladeshi community, who call the stretch the Mini Mart. Walk it slowly — behind an unmarked shopfront at No. 109, a family firm has been roasting coffee for kopitiams for over thirty years, while the street changed around it.",
    lat: 1.308203,
    lng: 103.856436,
    x: 52,
    y: 58,
    facts: [
      { label: "Named after", value: "A. F. Desker, 1860s" },
      { label: "Today", value: "Little Bangladesh" },
    ],
    image: commonsImage("Desker_Road,_Singapore,_2023_(01).jpg", "Shophouses along Desker Road"),
    puzzle: {
      question:
        "Desker Road takes its name from Andre Filipe Desker. What business made him famous?",
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
        {
          title: "1860s — The butcher's street",
          body: "Named after Andre Filipe Desker, a Malacca-born Eurasian who ran the largest slaughterhouse in colonial Singapore.",
        },
        {
          title: "The cattle years",
          body: 'Grass and water made this area Singapore\'s cattle district from the 1850s. Lembu Road next door means "cattle" in Malay.',
        },
        {
          title: "Today — Little Bangladesh",
          body: "The stretch is now the heart of Singapore's Bangladeshi community, who call it the Mini Mart.",
        },
      ],
      footer: {
        text: "And at No. 109, behind an unmarked shopfront, coffee has been roasting through it all.",
        linkDemoId: "d-sinhin",
      },
    },
  },
  {
    id: 3,
    name: "Mustafa Mall Road",
    theme: "Textiles, henna & round-the-clock trade",
    location: "Syed Alwi Road, by Mustafa Centre",
    description:
      "Syed Alwi Road is where sari silk sits next to Malay tailors sits next to Chinese haberdashers, all selling cloth by the yard and none in the same language. Since the 1930s this stretch has been Singapore's fabric market — bolts of chiffon, brocade and cotton stacked to the ceiling, prices called out in three tongues and sealed with a nod. In 1971 a small garment shop called Mustafa opened here; it never stopped growing, and never stopped opening, becoming the 24-hour mall that now anchors the street. Bridal families still come to pick sari fabric, henna artists still work the five-foot ways, and the shopkeepers still remember which grandmother preferred which supplier.",
    lat: 1.309431,
    lng: 103.855739,
    x: 32,
    y: 40,
    facts: [
      { label: "Fabric trade since", value: "1930s" },
      { label: "Mustafa opened", value: "1971" },
    ],
    image: commonsImage(
      "Mustafa_Centre,_Little_India,_Singapore_(9005264972).jpg",
      "Mustafa Centre on Syed Alwi Road",
    ),
    puzzle: {
      question: "What has the street outside Mustafa primarily traded in for nearly a century?",
      options: ["Spices", "Textiles and fabric", "Gold jewellery", "Timber"],
      correctIndex: 1,
      hint: "By the yard, in bolts stacked to the ceiling.",
    },
  },
  {
    id: 4,
    name: "New World Gate, City Square Mall",
    theme: "Singapore's first amusement park",
    location: "City Square Mall, Kitchener Road",
    description:
      "The gate you just scanned once swallowed thousands of people a night. This was New World — Singapore's first amusement park, opened in 1923 by Straits Chinese brothers Ong Boon Tat and Ong Peng Hock, and the original of the three great \"Worlds\" that Great World and Gay World later copied. Packed into 45,000 square feet along Jalan Besar were rides, carousels, open-air cinemas, boxing and wrestling arenas, dance halls and no fewer than five opera stages. You could spend a whole day inside: family photo, haircut at the barber, hawker dinner, a stroll in the park — and never see it all. The park is gone, but its gate still stands where you do now: the only physical remnant of Singapore's first playground.",
    lat: 1.311825,
    lng: 103.855653,
    x: 72,
    y: 34,
    facts: [
      { label: "Opened", value: "1923" },
      { label: "Size", value: "~45,000 sq ft" },
      { label: "Closed", value: "April 1987" },
      { label: "Gate rebuilt", value: "January 2011" },
    ],
    image: commonsImage(
      "New_World_Gateway%E2%80%94Singapore.jpg",
      "The reconstructed New World gate at City Square",
    ),
    puzzle: {
      question: "The historic gate outside City Square Mall once welcomed visitors to what?",
      options: [
        "A colonial railway station",
        "New World Amusement Park",
        "A cattle market",
        "A cinema hall",
      ],
      correctIndex: 1,
      hint: 'Opera stages, cabaret dance halls and wrestling arenas — Singapore\'s first great "World".',
    },
    highlights: {
      heading: "New World Gate",
      subheading: "Singapore's first amusement park",
      blocks: [
        {
          title: "1923 — The Ong brothers open the gates",
          body: 'Ong Boon Tat and Ong Peng Hock, sons of businessman Ong Sam Leong, opened New World as the first of the three "Worlds" — Great World (early 1930s) and Gay World (1936) followed. It sprawled across about 45,000 sq ft along Jalan Besar.',
        },
        {
          title: "Five opera stages under one roof",
          body: "Peking opera at the Octagonal Pavilion (Bajiao Ting) and the indoor Wa Wutai, a Fujian opera stage, Chaozhou opera at Bai Lao Hui — home of the Lau Sai Thor Guan Teochew Wayang troupe — and Cantonese opera at Riguang Tai (Sunshine Stage), said to be the park's biggest theatre.",
        },
        {
          title: "Names on the marquee",
          body: 'Wrestler King Kong (Hungarian Emile Czaya), strongman Mat Tarzan, boxer Felix Boy — and Rose Chan, the 1950s "Queen of Strip", who also wrestled pythons and bent iron bars. In 1949 Madame Tai Fong\'s Fong Fong Revue drew crowds so large the colonial police warned that "this monkey business must cease."',
        },
        {
          title: "The part nobody puts on a poster",
          body: 'The cabaret "lancing girls" — three dance coupons for as little as a dollar — were philanthropists too. The Singapore Dance Hostesses\' Association raised $13,000 for the Nanyang University building fund in 1953, and Rose Chan gave to charities for children, the elderly, TB patients and the blind.',
        },
        {
          title: "1987 — Lights out, gate stays",
          body: "Television, discos and shopping malls killed the park; it closed for good in April 1987 and Shaw sold the land to CDL. City Square Mall rose in its place, and in January 2011 the gate was reconstructed at City Green with NParks, NHB and URA — come back after dark for the light show projected onto it.",
        },
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
    lat: 1.309403,
    lng: 103.854767,
    x: 88,
    y: 62,
    facts: [
      { label: '"Lembu" means', value: "Cattle (Malay)" },
      { label: "Cattle trade", value: "1850s–1920s" },
    ],
    image: commonsImage("Lembu_Road,_Singapore,_2023_(01).jpg", "Lembu Road, off Jalan Besar"),
    puzzle: {
      question: 'What does "Lembu" — the road this open space sits on — mean in Malay?',
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
  {
    id: "d1",
    stopId: 1,
    title: "Live food preparation by local hawkers",
    vendor: "Berseh Food Centre hawkers",
    start: "10:00",
    end: "11:30",
  },
  {
    id: "d2",
    stopId: 3,
    title: "Henna art demonstrations",
    vendor: "Syed Alwi henna artists",
    start: "12:00",
    end: "13:00",
  },
  {
    id: "d-sinhin",
    stopId: 2,
    title: "Traditional coffee roasting by Sin Hin & Co",
    vendor: "Sin Hin & Co.",
    location: "109 Desker Road",
    start: "14:00",
    end: "16:00",
    detail: {
      heading: "Sin Hin & Co.",
      subheading: "Traditional coffee roasting · 109 Desker Road",
      body: "There's no sign worth noticing at No. 109. That's the point — Sin Hin sells to kopitiams, not to you. For over thirty years, this family firm has processed coffee beans on Desker Road, weekday mornings, weekends off, while the street changed around it.",
      rows: [
        { label: "Demo slot", value: "Daily, 2:00–4:00pm" },
        { label: "What you'll see", value: "green beans going in, a caramelised block coming out" },
      ],
    },
  },
  {
    id: "d5",
    stopId: 5,
    title: "Mural painting & floor art",
    vendor: "Lembu Road community artists",
    start: "16:30",
    end: "18:00",
  },
  {
    id: "d4",
    stopId: 4,
    title: "Cultural dance performances & Light Show",
    vendor: "New World Gate heritage stage",
    start: "19:30",
    end: "21:00",
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
  const list = DEMOS.filter((d) => d.stopId === stopId).map((d) => ({
    d,
    info: getDemoStatusInfo(d, now),
  }));
  const live = list.find((x) => x.info.state === "live");
  if (live) return { kind: "live", demo: live.d };
  const upcoming = list
    .filter((x) => x.info.state === "upcoming" || x.info.state === "soon")
    .sort((a, b) => a.info.msToStart - b.info.msToStart)[0];
  if (upcoming) return { kind: "upcoming", demo: upcoming.d };
  return { kind: "none" };
}

/** Active or next demo (live/soon/upcoming) at this stop today. */
export function getActiveOrUpcomingDemo(
  stopId: number,
  now = new Date(),
): (DemoSlot & { info: DemoStatusInfo }) | null {
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
  {
    id: "jalan-champion",
    name: "Jalan Champion",
    description: "Full trail completion",
    emoji: "🏆",
  },
];

export interface Reward {
  id: string;
  business: string;
  offer: string;
  code: string;
  requiredStops: number;
}

export const REWARDS: Reward[] = [
  {
    id: "kopi-01",
    business: "Berseh Kopi Uncle",
    offer: "1-for-1 kopi + kaya toast",
    code: "JALAN-KOPI",
    requiredStops: 1,
  },
  {
    id: "textile-01",
    business: "Syed Alwi Textile Co.",
    offer: "15% off any fabric",
    code: "JALAN-CLOTH",
    requiredStops: 3,
  },
  {
    id: "desker-01",
    business: "Desker Road Hardware",
    offer: "Free engraved key tag",
    code: "JALAN-BRASS",
    requiredStops: 4,
  },
  {
    id: "world-01",
    business: "City Square Mall",
    offer: "$5 heritage trail voucher",
    code: "JALAN-WORLD",
    requiredStops: 5,
  },
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
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
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
