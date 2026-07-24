// Demo Mode — for live presentation use.
// A visitor can tap "Enter as Demo Visitor" on /auth to try the full app
// without an account: answering questions and collecting stamps included.
// Demo progress lives in this browser's localStorage only.

const KEY = "jalan-demo-mode";
const VISITS_KEY = "jalan-demo-visits";

export function isDemoMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function enableDemoMode() {
  try {
    window.localStorage.setItem(KEY, "1");
  } catch {
    /* noop */
  }
}

export function disableDemoMode() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}

/** Map of stopId → ISO timestamp of when the demo visitor completed it. */
export function getDemoVisits(): Record<number, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(VISITS_KEY) ?? "{}") as Record<number, string>;
  } catch {
    return {};
  }
}

export function getDemoVisitedStopIds(): number[] {
  return Object.keys(getDemoVisits()).map(Number);
}

export function recordDemoVisit(stopId: number) {
  try {
    const visits = getDemoVisits();
    visits[stopId] = new Date().toISOString();
    window.localStorage.setItem(VISITS_KEY, JSON.stringify(visits));
  } catch {
    /* noop */
  }
}
