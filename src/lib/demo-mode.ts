// Demo Mode — for live presentation use.
// A visitor can tap "Enter as Demo Visitor" on /auth to bypass account
// creation and try the full app. Nothing is persisted for demo visitors.

const KEY = "jalan-demo-mode";

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
