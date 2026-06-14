import { getMastery, MASTERY, type MasteryLevel } from "@/lib/mastery";

export function MasteryBadge({
  interval,
  repetitions,
  level,
}: (
  | { interval: number; repetitions: number; level?: never }
  | { level: MasteryLevel; interval?: never; repetitions?: never }
)) {
  const mastery = level ?? getMastery(interval!, repetitions!);
  const meta = MASTERY[mastery];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${meta.color} ${meta.bg} ${meta.border}`}
    >
      {meta.label}
    </span>
  );
}
