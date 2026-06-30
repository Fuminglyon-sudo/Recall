const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function StreakCalendar({ reviewDays }: { reviewDays: string[] }) {
  const reviewed = new Set(reviewDays);

  // Build last 28 days (4 full weeks), Monday-aligned
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days: Date[] = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }

  const toKey = (d: Date) => d.toISOString().split("T")[0];
  const todayKey = toKey(today);

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Streak calendar</p>
          <p className="mt-1 text-base font-semibold text-white">Last 28 days</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-emerald-400/80" />
            Reviewed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-white/8" />
            Skipped
          </span>
        </div>
      </div>

      {/* Day-of-week headers */}
      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {DAY_LABELS.map((d) => (
          <p key={d} className="text-center text-[10px] text-slate-600">{d}</p>
        ))}
        {days.map((d) => {
          const key = toKey(d);
          const done = reviewed.has(key);
          const isToday = key === todayKey;
          return (
            <div
              key={key}
              title={key}
              className={`aspect-square rounded-sm transition ${
                done
                  ? "bg-emerald-400/70"
                  : "bg-white/[0.05]"
              } ${isToday ? "ring-1 ring-white/30" : ""}`}
            />
          );
        })}
      </div>
    </div>
  );
}
