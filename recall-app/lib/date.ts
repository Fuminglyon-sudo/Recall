export function isSameCalendarDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function formatRelativeDay(date: Date) {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function startOfToday() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

/**
 * Start of "today" in the caller's local calendar day, given the value of
 * `new Date().getTimezoneOffset()` from their browser.
 *
 * The server runs in UTC, so truncating Date.now() with setHours(0,0,0,0)
 * truncates to the UTC calendar day — for a user ahead of UTC (e.g. Lagos,
 * UTC+1), a review done just after their local midnight still falls in the
 * previous UTC day, miscrediting their streak. Shifting the timestamp by
 * the client's offset before truncating aligns the boundary with the
 * user's actual local midnight instead of the server's.
 */
export function startOfLocalDay(tzOffsetMinutes: number): Date {
  // isSameCalendarDay() (and the rest of this module) reads calendar fields
  // via the local getters, so this must truncate the same way — with
  // setHours(), not setUTCHours() — to stay in the same frame of reference.
  const shifted = new Date(Date.now() - tzOffsetMinutes * 60_000);
  shifted.setHours(0, 0, 0, 0);
  return shifted;
}
