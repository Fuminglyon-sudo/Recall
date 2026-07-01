import { applySm2 } from "@/lib/sm2";

const BASE = { easeFactor: 2.5, interval: 0, repetitions: 0 };
const NOW = new Date("2025-01-01T00:00:00.000Z");
const days = (n: number) => new Date(NOW.getTime() + n * 86_400_000);

describe("applySm2 — failing grades (< 3)", () => {
  test.each([0, 1, 2])("grade %i resets repetitions to 0 and schedules tomorrow", (grade) => {
    const r = applySm2({ ...BASE, repetitions: 5, interval: 21, grade, now: NOW });
    expect(r.repetitions).toBe(0);
    expect(r.interval).toBe(1);
    expect(r.dueAt).toEqual(days(1));
  });

  test("ease factor decreases but never below 1.3 on repeated fails", () => {
    let state = { ...BASE, easeFactor: 1.4, interval: 5, repetitions: 3 };
    state = applySm2({ ...state, grade: 0, now: NOW });
    expect(state.easeFactor).toBeCloseTo(1.3, 5);
    state = applySm2({ ...state, grade: 0, now: NOW });
    expect(state.easeFactor).toBe(1.3); // clamps at minimum
  });
});

describe("applySm2 — passing grades (>= 3)", () => {
  test("first review (rep=0 → rep=1) sets interval to 1", () => {
    const r = applySm2({ ...BASE, grade: 4, now: NOW });
    expect(r.repetitions).toBe(1);
    expect(r.interval).toBe(1);
    expect(r.dueAt).toEqual(days(1));
  });

  test("second review (rep=1 → rep=2) sets interval to 6", () => {
    const r = applySm2({ ...BASE, repetitions: 1, interval: 1, grade: 4, now: NOW });
    expect(r.repetitions).toBe(2);
    expect(r.interval).toBe(6);
    expect(r.dueAt).toEqual(days(6));
  });

  test("third review uses interval * easeFactor", () => {
    const r = applySm2({ ...BASE, repetitions: 2, interval: 6, grade: 4, now: NOW });
    expect(r.repetitions).toBe(3);
    // nextEF ≈ 2.5 + 0.1 - 1*(0.08 + 0.02) = 2.5
    expect(r.interval).toBe(Math.round(6 * 2.5));
    expect(r.dueAt).toEqual(days(r.interval));
  });

  test("perfect grade (5) increases ease factor", () => {
    const r = applySm2({ ...BASE, repetitions: 2, interval: 6, grade: 5, now: NOW });
    expect(r.easeFactor).toBeGreaterThan(2.5);
  });

  test("grade 3 slightly decreases ease factor", () => {
    const r = applySm2({ ...BASE, repetitions: 2, interval: 6, grade: 3, now: NOW });
    expect(r.easeFactor).toBeLessThan(2.5);
    expect(r.easeFactor).toBeGreaterThanOrEqual(1.3);
  });
});

describe("applySm2 — grade bounds", () => {
  test("grade below 0 is clamped to 0 (fails)", () => {
    const r = applySm2({ ...BASE, repetitions: 5, interval: 21, grade: -1, now: NOW });
    expect(r.repetitions).toBe(0);
  });

  test("grade above 5 is clamped to 5 (perfect)", () => {
    const r5 = applySm2({ ...BASE, repetitions: 2, interval: 6, grade: 5, now: NOW });
    const r10 = applySm2({ ...BASE, repetitions: 2, interval: 6, grade: 10, now: NOW });
    expect(r10.easeFactor).toBeCloseTo(r5.easeFactor, 10);
  });
});
