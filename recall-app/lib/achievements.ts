export type Achievement = {
  id: string;
  label: string;
  description: string;
  emoji: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_review",     emoji: "✦",  label: "First review",       description: "Completed your first review session." },
  { id: "streak_3",         emoji: "🔥",  label: "3-day streak",       description: "Reviewed 3 days in a row." },
  { id: "streak_7",         emoji: "⚡",  label: "7-day streak",       description: "Reviewed 7 days in a row." },
  { id: "streak_30",        emoji: "💎",  label: "30-day streak",      description: "Reviewed 30 days in a row." },
  { id: "streak_60",        emoji: "🌙",  label: "60-day streak",      description: "Reviewed 60 days in a row." },
  { id: "streak_100",       emoji: "🏅",  label: "100-day streak",     description: "Reviewed 100 days in a row." },
  { id: "streak_180",       emoji: "👑",  label: "180-day streak",     description: "Reviewed 180 days in a row." },
  { id: "streak_365",       emoji: "🎂",  label: "365-day streak",     description: "A full year of reviews, one day at a time." },
  { id: "cards_50",         emoji: "📚",  label: "50 reviews",         description: "Completed 50 card reviews." },
  { id: "cards_100",        emoji: "🏆",  label: "100 reviews",        description: "Completed 100 card reviews." },
  { id: "first_mastered",   emoji: "★",  label: "First mastered",     description: "Your first word reached mastered level." },
  { id: "mastered_10",      emoji: "🎯",  label: "10 words mastered",  description: "10 words have reached mastered level." },
  { id: "speak_up_1",       emoji: "🎙",  label: "First Speak Up",     description: "Completed your first Speak Up session." },
  { id: "speak_up_score_8", emoji: "🌟",  label: "Score 8+",           description: "Achieved a Speak Up score of 8 or higher." },
];

export function getAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

// Streak-length milestones in ascending order, for the streak page's
// "next milestone" / unlock-progress display.
export const STREAK_MILESTONES = ACHIEVEMENTS.filter((a) => a.id.startsWith("streak_"));

/** IDs earned from a card review event. Supply nulls for fields not yet computed. */
export function achievementsFromReview({
  totalReviews,
  currentStreak,
  masteredCount,
}: {
  totalReviews: number;
  currentStreak: number;
  masteredCount: number;
}): string[] {
  const earned: string[] = [];
  if (totalReviews >= 1)   earned.push("first_review");
  if (currentStreak >= 3)   earned.push("streak_3");
  if (currentStreak >= 7)   earned.push("streak_7");
  if (currentStreak >= 30)  earned.push("streak_30");
  if (currentStreak >= 60)  earned.push("streak_60");
  if (currentStreak >= 100) earned.push("streak_100");
  if (currentStreak >= 180) earned.push("streak_180");
  if (currentStreak >= 365) earned.push("streak_365");
  if (totalReviews >= 50)  earned.push("cards_50");
  if (totalReviews >= 100) earned.push("cards_100");
  if (masteredCount >= 1)  earned.push("first_mastered");
  if (masteredCount >= 10) earned.push("mastered_10");
  return earned;
}

export function achievementsFromSpeakUp({ score }: { score: number }): string[] {
  const earned: string[] = ["speak_up_1"];
  if (score >= 8) earned.push("speak_up_score_8");
  return earned;
}
