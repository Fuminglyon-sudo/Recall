import { dateKey } from "./streak";

export type DayBucket = { key: string; label: string; count: number };

/**
 * Buckets a list of timestamps into daily counts for the trailing `days`
 * days (inclusive of the reference day), oldest first. Days with no events
 * are included with count 0 so charts render a continuous timeline instead
 * of skipping gaps.
 *
 * Uses the same local-getter dateKey() as the streak calendar so admin
 * charts bucket by the same notion of "day" as the rest of the app —
 * see lib/streak.ts for why local getters (not toISOString) matter here.
 */
export function bucketCountsByDay(
  timestamps: Date[],
  days: number,
  referenceDate: Date = new Date()
): DayBucket[] {
  const counts = new Map<string, number>();
  for (const t of timestamps) {
    const key = dateKey(t);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const buckets: DayBucket[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(referenceDate);
    d.setDate(d.getDate() - i);
    const key = dateKey(d);
    buckets.push({
      key,
      label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      count: counts.get(key) ?? 0,
    });
  }
  return buckets;
}
