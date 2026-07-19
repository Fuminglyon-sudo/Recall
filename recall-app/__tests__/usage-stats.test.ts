import { bucketCountsByDay } from "@/lib/usage-stats";

const REF = new Date(2026, 6, 19); // 19 July 2026, local time

describe("bucketCountsByDay", () => {
  test("returns `days` buckets ending on the reference day", () => {
    const buckets = bucketCountsByDay([], 7, REF);
    expect(buckets).toHaveLength(7);
    expect(buckets[6].key).toBe("2026-07-19");
    expect(buckets[0].key).toBe("2026-07-13");
  });

  test("empty input produces all-zero buckets, oldest first", () => {
    const buckets = bucketCountsByDay([], 3, REF);
    expect(buckets.map((b) => b.count)).toEqual([0, 0, 0]);
    expect(buckets.map((b) => b.key)).toEqual(["2026-07-17", "2026-07-18", "2026-07-19"]);
  });

  test("multiple timestamps on the same local day collapse into one bucket", () => {
    const buckets = bucketCountsByDay(
      [
        new Date(2026, 6, 19, 8, 0),
        new Date(2026, 6, 19, 23, 59),
        new Date(2026, 6, 19, 0, 1),
      ],
      1,
      REF
    );
    expect(buckets).toEqual([{ key: "2026-07-19", label: expect.any(String), count: 3 }]);
  });

  test("days with no events are still present with count 0 (no gaps)", () => {
    const buckets = bucketCountsByDay([new Date(2026, 6, 17)], 5, REF);
    expect(buckets.map((b) => b.count)).toEqual([0, 0, 1, 0, 0]);
  });

  test("timestamps outside the window are ignored", () => {
    const buckets = bucketCountsByDay(
      [new Date(2026, 5, 1), new Date(2026, 6, 19)],
      3,
      REF
    );
    expect(buckets.reduce((sum, b) => sum + b.count, 0)).toBe(1);
  });

  test("defaults `referenceDate` to now when omitted", () => {
    const buckets = bucketCountsByDay([], 1);
    expect(buckets[0].key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
