import { ACHIEVEMENTS, STREAK_MILESTONES, getAchievement, achievementsFromReview, achievementsFromSpeakUp } from "@/lib/achievements";

describe("achievement registry", () => {
  test("every achievement id is unique", () => {
    const ids = ACHIEVEMENTS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("getAchievement finds a known id and returns undefined for an unknown one", () => {
    expect(getAchievement("streak_100")?.label).toBe("100-day streak");
    expect(getAchievement("not_a_real_id")).toBeUndefined();
  });

  test("STREAK_MILESTONES contains exactly the streak_* tiers, in ascending order", () => {
    const ids = STREAK_MILESTONES.map((a) => a.id);
    expect(ids).toEqual(["streak_3", "streak_7", "streak_30", "streak_60", "streak_100", "streak_180", "streak_365"]);
  });
});

describe("achievementsFromReview — streak milestones", () => {
  test("a fresh account earns nothing", () => {
    const earned = achievementsFromReview({ totalReviews: 0, currentStreak: 0, masteredCount: 0 });
    expect(earned).toEqual([]);
  });

  test("crossing each streak tier earns exactly the tiers reached, not higher ones", () => {
    const at60 = achievementsFromReview({ totalReviews: 60, currentStreak: 60, masteredCount: 0 });
    expect(at60).toEqual(expect.arrayContaining(["streak_3", "streak_7", "streak_30", "streak_60"]));
    expect(at60).not.toContain("streak_100");
  });

  test("a 365-day streak earns every streak tier", () => {
    const earned = achievementsFromReview({ totalReviews: 365, currentStreak: 365, masteredCount: 0 });
    for (const tier of STREAK_MILESTONES) {
      expect(earned).toContain(tier.id);
    }
  });

  test("one day short of a tier does not earn it", () => {
    const earned = achievementsFromReview({ totalReviews: 99, currentStreak: 99, masteredCount: 0 });
    expect(earned).not.toContain("streak_100");
    expect(earned).toContain("streak_60");
  });
});

describe("achievementsFromSpeakUp", () => {
  test("always earns the first-session badge", () => {
    expect(achievementsFromSpeakUp({ score: 1 })).toContain("speak_up_1");
  });

  test("earns the score-8 badge only at 8 or above", () => {
    expect(achievementsFromSpeakUp({ score: 7 })).not.toContain("speak_up_score_8");
    expect(achievementsFromSpeakUp({ score: 8 })).toContain("speak_up_score_8");
  });
});
