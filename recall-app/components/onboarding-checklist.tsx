import Link from "next/link";

type Step = {
  label: string;
  body: string;
  cta: string;
  href: string;
  done: boolean;
};

export function OnboardingChecklist({
  hasCards,
  hasReviewed,
  hasTriedPractice,
}: {
  hasCards: boolean;
  hasReviewed: boolean;
  hasTriedPractice: boolean;
}) {
  const steps: Step[] = [
    {
      label: "Add your first word",
      body: "Type any word — AI drafts the definition, hook, and example. You edit and save.",
      cta: "Add a word",
      href: "/cards/new",
      done: hasCards,
    },
    {
      label: "Review it",
      body: "Spaced repetition brings it back right before you'd forget it.",
      cta: "Start review",
      href: "/today",
      done: hasReviewed,
    },
    {
      label: "Try a practice mode",
      body: "Speak Up, Small Talk Lab, or Debate Lab — say it out loud, get honest feedback.",
      cta: "Try Speak Up",
      href: "/speak-up",
      done: hasTriedPractice,
    },
  ];

  const doneCount = steps.filter((s) => s.done).length;
  if (doneCount === steps.length) return null;

  const nextHref = steps.find((s) => !s.done)?.href;
  const title =
    doneCount === 0 ? "Welcome — here's where to start" : doneCount === 1 ? "Nice start — here's what's next" : "Almost there";

  return (
    <div className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/5 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-emerald-400">{title}</p>
          <p className="mt-1 text-sm text-slate-300">
            {doneCount} of {steps.length} steps done.
          </p>
        </div>
        <div className="flex gap-1.5">
          {steps.map((s, i) => (
            <span key={i} className={`h-1.5 w-6 rounded-full ${s.done ? "bg-emerald-400" : "bg-white/10"}`} />
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {steps.map((s, i) => (
          <div
            key={i}
            className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 ${
              s.done ? "border-white/5 bg-white/[0.02]" : "border-white/10 bg-white/[0.04]"
            }`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  s.done ? "bg-emerald-400 text-slate-950" : "border border-white/15 text-slate-400"
                }`}
              >
                {s.done ? "✓" : i + 1}
              </span>
              <div className="min-w-0">
                <p className={`text-sm font-medium ${s.done ? "text-slate-400 line-through decoration-slate-600" : "text-white"}`}>
                  {s.label}
                </p>
                {!s.done ? <p className="text-xs text-slate-400">{s.body}</p> : null}
              </div>
            </div>
            {!s.done && s.href === nextHref ? (
              <Link
                href={s.href}
                className="shrink-0 rounded-xl bg-emerald-400 px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                {s.cta}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
