import { getMastery, computeDistribution } from "@/lib/mastery";

describe("getMastery", () => {
  test("repetitions === 0 → new (regardless of interval)", () => {
    expect(getMastery(0, 0)).toBe("new");
    expect(getMastery(100, 0)).toBe("new");
  });

  test("interval < 7 → learning", () => {
    expect(getMastery(1, 1)).toBe("learning");
    expect(getMastery(6, 3)).toBe("learning");
  });

  test("7 <= interval < 21 → familiar", () => {
    expect(getMastery(7, 2)).toBe("familiar");
    expect(getMastery(20, 4)).toBe("familiar");
  });

  test("interval >= 21 → mastered", () => {
    expect(getMastery(21, 5)).toBe("mastered");
    expect(getMastery(365, 20)).toBe("mastered");
  });
});

describe("computeDistribution", () => {
  test("empty array returns all zeros", () => {
    expect(computeDistribution([])).toEqual({ new: 0, learning: 0, familiar: 0, mastered: 0 });
  });

  test("counts each level correctly", () => {
    const cards = [
      { interval: 0, repetitions: 0 },  // new
      { interval: 1, repetitions: 1 },  // learning
      { interval: 6, repetitions: 2 },  // learning
      { interval: 10, repetitions: 3 }, // familiar
      { interval: 21, repetitions: 5 }, // mastered
      { interval: 90, repetitions: 8 }, // mastered
    ];
    expect(computeDistribution(cards)).toEqual({ new: 1, learning: 2, familiar: 1, mastered: 2 });
  });

  test("all new cards", () => {
    const cards = Array.from({ length: 5 }, () => ({ interval: 0, repetitions: 0 }));
    expect(computeDistribution(cards).new).toBe(5);
  });
});
