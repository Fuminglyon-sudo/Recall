import { ACHIEVEMENTS, STREAK_MILESTONES, getAchievement, achievementsFromReview, achievementsFromSpeakUp, achievementsFromStreak } from "@/lib/achievements";

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

describe("achievementsFromStreak", () => {
  // Regression coverage for extending the streak to every practice
  // activity: a debate/Speak Up/Conversation Lab streak must earn the
  // same milestones a review streak would, via the same shared function
  // gradeCard, /api/debate, /api/speak-grade, and /api/social-conversation
  // all now call.
  test("a streak of 0 earns nothing", () => {
    expect(achievementsFromStreak(0)).toEqual([]);
  });

  test("earns exactly the tiers reached, not higher ones", () => {
    const earned = achievementsFromStreak(60);
    expect(earned).toEqual(expect.arrayContaining(["streak_3", "streak_7", "streak_30", "streak_60"]));
    expect(earned).not.toContain("streak_100");
  });

  test("earns every tier at 365", () => {
    const earned = achievementsFromStreak(365);
    expect(earned).toEqual(STREAK_MILESTONES.map((m) => m.id));
  });

  test("achievementsFromReview's streak tiers match achievementsFromStreak exactly", () => {
    for (const streak of [0, 3, 6, 7, 29, 30, 59, 60, 99, 100, 179, 180, 364, 365, 400]) {
      const fromReview = achievementsFromReview({ totalReviews: 0, currentStreak: streak, masteredCount: 0 })
        .filter((id) => id.startsWith("streak_"));
      expect(fromReview.sort()).toEqual(achievementsFromStreak(streak).sort());
    }
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
