const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function UpcomingReviews({ byDay }: { byDay: Record<string, number> }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + 1 + i);
    return d;
  });

  const toKey = (d: Date) => d.toISOString().split("T")[0];
  const max = Math.max(1, ...days.map((d) => byDay[toKey(d)] ?? 0));

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Upcoming reviews</p>
      <p className="mt-1 text-base font-semibold text-white">Next 7 days</p>

      <div className="mt-5 grid grid-cols-7 gap-2">
        {days.map((d) => {
          const key = toKey(d);
          const count = byDay[key] ?? 0;
          const pct = (count / max) * 100;
          return (
            <div key={key} className="flex flex-col items-center gap-2">
              {/* Bar */}
              <div className="relative flex h-16 w-full items-end overflow-hidden rounded-xl bg-white/5">
                {count > 0 ? (
                  <div
                    className="w-full rounded-xl bg-emerald-400/50 transition-all"
                    style={{ height: `${Math.max(pct, 12)}%` }}
                  />
                ) : null}
              </div>
              <p className="text-[10px] font-medium text-slate-500">{DAY_SHORT[d.getDay()]}</p>
              <p className={`text-xs font-semibold ${count > 0 ? "text-emerald-300" : "text-slate-600"}`}>
                {count > 0 ? count : "—"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
