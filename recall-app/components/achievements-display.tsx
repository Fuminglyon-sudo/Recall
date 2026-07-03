import { getAchievement, ACHIEVEMENTS } from "@/lib/achievements";

type EarnedAchievement = { achievementId: string; unlockedAt: Date };

export function AchievementsDisplay({ earned }: { earned: EarnedAchievement[] }) {
  if (earned.length === 0) return null;

  const sorted = [...earned].sort(
    (a, b) => b.unlockedAt.getTime() - a.unlockedAt.getTime()
  );
  const total = ACHIEVEMENTS.length;

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Milestones</p>
        <p className="text-xs text-slate-600">{earned.length} / {total} unlocked</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {sorted.map((a) => {
          const meta = getAchievement(a.achievementId);
          if (!meta) return null;
          return (
            <div
              key={a.achievementId}
              className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5"
            >
              <span className="text-xl leading-none">{meta.emoji}</span>
              <div>
                <p className="text-xs font-semibold text-white">{meta.label}</p>
                <p className="mt-0.5 text-[10px] leading-4 text-slate-500">{meta.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
