// Shared consent state for Google Consent Mode v2. Analytics (Google
// Analytics) is the only non-essential storage this app uses, so there is
// a single toggle rather than a full IAB-style category list.
//
// Storing the choice in localStorage (not a cookie) keeps this out of
// every request header, and reading/writing it is centralised here so the
// banner, the footer link, and the privacy page all stay in sync without
// a shared React context — components just dispatch/listen for a DOM event.

export type ConsentChoice = { analytics: boolean; timestamp: number };

const STORAGE_KEY = "soro-soke-cookie-consent";
const REOPEN_EVENT = "soro-soke-open-cookie-settings";

export function getStoredConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentChoice>;
    return typeof parsed.analytics === "boolean" ? { analytics: parsed.analytics, timestamp: parsed.timestamp ?? 0 } : null;
  } catch {
    return null;
  }
}

// Persists the choice and immediately reflects it in Consent Mode — this is
// the only place `gtag('consent', 'update', ...)` is called from client code,
// so the stored preference and what Analytics is actually allowed to do can
// never drift apart.
export function saveConsent(analytics: boolean): void {
  const choice: ConsentChoice = { analytics, timestamp: Date.now() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(choice));
  } catch {
    // Storage unavailable (private browsing, disabled storage) — consent
    // still applies for this page load via the gtag call below, it just
    // won't be remembered next visit, so the banner will ask again.
  }
  const w = window as typeof window & { gtag?: (...args: unknown[]) => void };
  w.gtag?.("consent", "update", { analytics_storage: analytics ? "granted" : "denied" });
}

// Withdrawal has to be as easy as giving consent (GDPR Art. 7(3)) — this is
// what the footer's "Cookie settings" link and the privacy page's button
// both call to reopen the banner at any time, instead of telling someone to
// go clear their browser storage.
export function openCookieSettings(): void {
  window.dispatchEvent(new Event(REOPEN_EVENT));
}

export function onOpenCookieSettings(handler: () => void): () => void {
  window.addEventListener(REOPEN_EVENT, handler);
  return () => window.removeEventListener(REOPEN_EVENT, handler);
}
