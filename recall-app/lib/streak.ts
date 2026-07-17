// A streak is "perfect" if the account has never used a recovery, or the
// last recovery happened before the current streak started (i.e. in some
// earlier streak, not this one).
export function isPerfectStreak(recoveryUsedAt: Date | null, streakStartedAt: Date | null): boolean {
  if (!recoveryUsedAt) return true;
  if (!streakStartedAt) return false;
  return recoveryUsedAt.getTime() < streakStartedAt.getTime();
}

// Local getters, not toISOString() — this must match the local Date
// arithmetic buildMonthGrid uses to construct each cell. Mixing UTC-based
// keys with local-constructed dates shifts every key by a day in any
// timezone ahead of UTC (production runs in UTC, so this is invisible
// there, but it broke local calendar-day matching everywhere else).
export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export type CalendarDay = {
  date: Date;
  dateKey: string;
  dayOfMonth: number;
  reviewed: boolean;
  isToday: boolean;
  isFuture: boolean;
  inMonth: boolean;
  // Whether the chronologically adjacent day is also reviewed and in the
  // same week row — used to render consecutive streak days as one
  // continuous pill instead of separate dots.
  joinPrev: boolean;
  joinNext: boolean;
};

/**
 * Builds a Sunday-first calendar grid for the given month (full weeks, so
 * leading/trailing days from adjacent months are included for alignment).
 * @param year four-digit year
 * @param month 0-indexed (0 = January)
 */
export function buildMonthGrid(year: number, month: number, reviewedDateKeys: Set<string>, today: Date): CalendarDay[] {
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay(); // 0 = Sunday
  const gridStart = new Date(year, month, 1 - startOffset);

  const lastOfMonth = new Date(year, month + 1, 0);
  const endOffset = 6 - lastOfMonth.getDay();
  const totalDays = startOffset + lastOfMonth.getDate() + endOffset;

  const todayKey = dateKey(today);
  const reviewedFlags: boolean[] = [];
  const days: CalendarDay[] = [];

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    const key = dateKey(d);
    const reviewed = reviewedDateKeys.has(key);
    reviewedFlags.push(reviewed);
    days.push({
      date: d,
      dateKey: key,
      dayOfMonth: d.getDate(),
      reviewed,
      isToday: key === todayKey,
      isFuture: d.getTime() > today.getTime(),
      inMonth: d.getMonth() === month,
      joinPrev: false,
      joinNext: false,
    });
  }

  // A day joins its neighbor only within the same week row (index % 7),
  // matching the grid's own row boundaries rather than the calendar's.
  for (let i = 0; i < days.length; i++) {
    if (!days[i].reviewed) continue;
    const col = i % 7;
    if (col > 0 && days[i - 1].reviewed) {
      days[i].joinPrev = true;
      days[i - 1].joinNext = true;
    }
  }

  return days;
}
