import { isPerfectStreak, dateKey, buildMonthGrid } from "@/lib/streak";

describe("isPerfectStreak", () => {
  test("never recovered is perfect", () => {
    expect(isPerfectStreak(null, new Date("2026-07-01"))).toBe(true);
  });

  test("recovery used before the current streak started is still perfect", () => {
    expect(isPerfectStreak(new Date("2026-06-01"), new Date("2026-07-01"))).toBe(true);
  });

  test("recovery used after the current streak started is not perfect", () => {
    expect(isPerfectStreak(new Date("2026-07-15"), new Date("2026-07-01"))).toBe(false);
  });

  test("recovery used with no recorded streak start is conservatively not perfect", () => {
    expect(isPerfectStreak(new Date("2026-07-15"), null)).toBe(false);
  });
});

describe("dateKey", () => {
  test("formats as YYYY-MM-DD", () => {
    expect(dateKey(new Date("2026-07-16T15:30:00Z"))).toBe("2026-07-16");
  });
});

describe("buildMonthGrid", () => {
  test("July 2026 starts on a Wednesday, so the grid has 3 leading days from June", () => {
    // Sanity-check against the reference screenshot: July 1 2026 fell on a
    // Wednesday, so the Sunday-first grid shows Su/Mo/Tu from June first.
    const today = new Date(2026, 6, 16);
    const grid = buildMonthGrid(2026, 6, new Set(), today);
    const leading = grid.filter((d) => !d.inMonth && d.date < new Date(2026, 6, 1));
    expect(leading.length).toBe(3);
    expect(grid[0].dayOfMonth).toBe(28); // June 28
  });

  test("marks reviewed days from the provided set", () => {
    const today = new Date(2026, 6, 16);
    const reviewed = new Set(["2026-07-05", "2026-07-06"]);
    const grid = buildMonthGrid(2026, 6, reviewed, today);
    const day5 = grid.find((d) => d.dateKey === "2026-07-05")!;
    const day7 = grid.find((d) => d.dateKey === "2026-07-07")!;
    expect(day5.reviewed).toBe(true);
    expect(day7.reviewed).toBe(false);
  });

  test("marks today and future days correctly", () => {
    const today = new Date(2026, 6, 16);
    const grid = buildMonthGrid(2026, 6, new Set(), today);
    const todayCell = grid.find((d) => d.dateKey === "2026-07-16")!;
    const futureCell = grid.find((d) => d.dateKey === "2026-07-17")!;
    const pastCell = grid.find((d) => d.dateKey === "2026-07-15")!;
    expect(todayCell.isToday).toBe(true);
    expect(futureCell.isFuture).toBe(true);
    expect(pastCell.isFuture).toBe(false);
  });

  test("consecutive reviewed days within the same week row join together", () => {
    const today = new Date(2026, 6, 16);
    // July 5-11 2026 is a single full week row (Sun-Sat) per the reference screenshot.
    const reviewed = new Set(["2026-07-05", "2026-07-06", "2026-07-07", "2026-07-08", "2026-07-09", "2026-07-10", "2026-07-11"]);
    const grid = buildMonthGrid(2026, 6, reviewed, today);
    const mid = grid.find((d) => d.dateKey === "2026-07-08")!;
    const start = grid.find((d) => d.dateKey === "2026-07-05")!;
    const end = grid.find((d) => d.dateKey === "2026-07-11")!;
    expect(mid.joinPrev).toBe(true);
    expect(mid.joinNext).toBe(true);
    expect(start.joinPrev).toBe(false); // first column of its row — nothing to its left
    expect(end.joinNext).toBe(false); // last column of its row — nothing to its right
  });

  test("a reviewed day does not join an unreviewed neighbor", () => {
    const today = new Date(2026, 6, 16);
    const reviewed = new Set(["2026-07-08"]);
    const grid = buildMonthGrid(2026, 6, reviewed, today);
    const isolated = grid.find((d) => d.dateKey === "2026-07-08")!;
    expect(isolated.joinPrev).toBe(false);
    expect(isolated.joinNext).toBe(false);
  });

  test("a run does not join across a week-row boundary even if both ends are reviewed", () => {
    const today = new Date(2026, 6, 16);
    // July 11 is a Saturday (last column); July 12 is a Sunday (first column
    // of the next row) per the reference screenshot's second highlighted band.
    const reviewed = new Set(["2026-07-11", "2026-07-12"]);
    const grid = buildMonthGrid(2026, 6, reviewed, today);
    const sat = grid.find((d) => d.dateKey === "2026-07-11")!;
    const sun = grid.find((d) => d.dateKey === "2026-07-12")!;
    expect(sat.joinNext).toBe(false);
    expect(sun.joinPrev).toBe(false);
  });
});
