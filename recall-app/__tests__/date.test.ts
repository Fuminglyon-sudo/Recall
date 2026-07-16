import { isSameCalendarDay, startOfLocalDay } from "@/lib/date";

describe("isSameCalendarDay", () => {
  test("same date is the same day", () => {
    expect(isSameCalendarDay(new Date(2026, 6, 16, 1), new Date(2026, 6, 16, 23))).toBe(true);
  });

  test("different dates are not the same day", () => {
    expect(isSameCalendarDay(new Date(2026, 6, 16), new Date(2026, 6, 17))).toBe(false);
  });
});

describe("startOfLocalDay", () => {
  afterEach(() => jest.useRealTimers());

  test("always truncates to local midnight, regardless of offset", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-07-16T15:42:07.123Z"));
    for (const offset of [0, -60, 300, -330, 720]) {
      const result = startOfLocalDay(offset);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    }
  });

  test("matches new Date().setHours(0,0,0,0) when offset is 0", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-07-16T15:42:07.123Z"));
    const result = startOfLocalDay(0);
    const expected = new Date();
    expected.setHours(0, 0, 0, 0);
    expect(result.getTime()).toBe(expected.getTime());
  });

  // Regression coverage for C4's timezone tail: a user ahead of UTC (e.g.
  // Lagos, UTC+1, offset -60) reviewing just after their local midnight
  // must not be credited to the previous day. A full 24h swing in offset
  // (0 vs 1440 minutes) must shift the truncated boundary by exactly one
  // day — this is the arithmetic the original bug got backwards.
  test("a 24-hour difference in offset shifts the local-day boundary by exactly one day", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-07-16T15:00:00.000Z"));
    const dayA = startOfLocalDay(0);
    const dayB = startOfLocalDay(1440); // pretend to be 24h "behind" UTC
    const oneDayMs = 24 * 60 * 60 * 1000;
    expect(dayA.getTime() - dayB.getTime()).toBe(oneDayMs);
  });

  test("matches the documented formula exactly (shift then truncate)", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-07-16T23:30:00.000Z"));
    const offset = -60; // Lagos, UTC+1
    const result = startOfLocalDay(offset);
    const expected = new Date(Date.now() - offset * 60_000);
    expected.setHours(0, 0, 0, 0);
    expect(result.getTime()).toBe(expected.getTime());
  });
});
