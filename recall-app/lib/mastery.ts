export type MasteryLevel = "new" | "learning" | "familiar" | "mastered";

export function getMastery(interval: number, repetitions: number): MasteryLevel {
  if (repetitions === 0) return "new";
  if (interval < 7) return "learning";
  if (interval < 21) return "familiar";
  return "mastered";
}

export const MASTERY = {
  new: {
    label: "New",
    color: "text-slate-400",
    bg: "bg-slate-400/10",
    border: "border-slate-400/20",
    bar: "bg-slate-500",
  },
  learning: {
    label: "Learning",
    color: "text-orange-300",
    bg: "bg-orange-400/10",
    border: "border-orange-400/25",
    bar: "bg-orange-400",
  },
  familiar: {
    label: "Familiar",
    color: "text-sky-300",
    bg: "bg-sky-400/10",
    border: "border-sky-400/25",
    bar: "bg-sky-400",
  },
  mastered: {
    label: "Mastered",
    color: "text-emerald-300",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/25",
    bar: "bg-emerald-400",
  },
} satisfies Record<MasteryLevel, { label: string; color: string; bg: string; border: string; bar: string }>;

export type MasteryDistribution = Record<MasteryLevel, number>;

export function computeDistribution(
  cards: { interval: number; repetitions: number }[],
): MasteryDistribution {
  const dist: MasteryDistribution = { new: 0, learning: 0, familiar: 0, mastered: 0 };
  for (const card of cards) {
    dist[getMastery(card.interval, card.repetitions)]++;
  }
  return dist;
}
