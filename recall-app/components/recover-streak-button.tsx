"use client";

import { useTransition, useState } from "react";
import { recoverStreak } from "@/app/today/actions";

export function RecoverStreakButton({ longestStreak }: { longestStreak: number }) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (done) {
    return (
      <div className="rounded-[2rem] border border-emerald-400/25 bg-emerald-400/8 px-5 py-4">
        <p className="text-sm font-semibold text-emerald-300">Streak restored to {longestStreak}</p>
        <p className="mt-1 text-xs text-emerald-200/60">Keep it going — review today to build on it.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-amber-400/20 bg-amber-400/5 px-5 py-4">
      <p className="text-sm font-semibold text-amber-300">Your streak broke</p>
      <p className="mt-1 text-xs leading-5 text-amber-200/60">
        You had a {longestStreak}-day streak. Use your one recovery to restore it — available once every 7 days.
      </p>
      {error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}
      <button
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await recoverStreak();
            if (result?.ok) setDone(true);
            else if (result?.error) setError(result.error);
          })
        }
        className="mt-3 inline-flex items-center gap-1.5 rounded-2xl border border-amber-400/30 bg-amber-400/12 px-4 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-400/20 disabled:opacity-50"
      >
        {pending ? "Restoring…" : `Restore ${longestStreak}-day streak`}
      </button>
    </div>
  );
}
