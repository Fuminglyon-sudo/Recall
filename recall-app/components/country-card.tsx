"use client";

import { useState, useTransition } from "react";

const GRADES = [
  { value: 0, label: "Blackout",  style: "border-red-500/30    bg-red-500/10    text-red-300    hover:bg-red-500/20" },
  { value: 1, label: "Wrong",     style: "border-red-400/25    bg-red-400/8     text-red-300    hover:bg-red-400/15" },
  { value: 2, label: "Hard",      style: "border-orange-400/30 bg-orange-400/10 text-orange-300 hover:bg-orange-400/20" },
  { value: 3, label: "Okay",      style: "border-yellow-400/25 bg-yellow-400/8  text-yellow-300 hover:bg-yellow-400/15" },
  { value: 4, label: "Good",      style: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20" },
  { value: 5, label: "Perfect",   style: "border-emerald-300/40 bg-emerald-300/15 text-emerald-200 hover:bg-emerald-300/25" },
];

const CONTINENT_COLOR: Record<string, string> = {
  Africa:      "text-amber-300 border-amber-400/25 bg-amber-400/8",
  Americas:    "text-sky-300   border-sky-400/25   bg-sky-400/8",
  Asia:        "text-rose-300  border-rose-400/25  bg-rose-400/8",
  "Middle East": "text-orange-300 border-orange-400/25 bg-orange-400/8",
  Europe:      "text-violet-300 border-violet-400/25 bg-violet-400/8",
  Oceania:     "text-teal-300  border-teal-400/25  bg-teal-400/8",
};

type CountryData = {
  id: string;
  name: string;
  flag: string;
  capital: string;
  continent: string;
  population: string | null;
  currency: string | null;
  languages: string;
  nationalFood: string | null;
  phraseLanguage: string | null;
  phraseHi: string | null;
  phraseMorning: string | null;
  phraseAfternoon: string | null;
  funFact: string | null;
  repetitions: number;
};

export function CountryCard({
  country,
  onGrade,
}: {
  country: CountryData;
  onGrade: (formData: FormData) => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const [pendingGrade, setPendingGrade] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const isNew = country.repetitions === 0;
  const badgeStyle = CONTINENT_COLOR[country.continent] ?? "text-slate-300 border-white/15 bg-white/5";

  function handleGrade(value: number) {
    setPendingGrade(value);
    const fd = new FormData();
    fd.set("id", country.id);
    fd.set("grade", String(value));
    startTransition(() => onGrade(fd));
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <span className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ${badgeStyle}`}>
          {country.continent}
        </span>
        {isNew ? (
          <span className="rounded-full border border-emerald-300/25 bg-emerald-400/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-emerald-300">
            New
          </span>
        ) : (
          <span className="text-xs text-slate-500">Seen {country.repetitions}×</span>
        )}
      </div>

      {/* Flag + Name */}
      <div className="mt-5 rounded-3xl border border-white/8 bg-slate-950/60 p-6 text-center">
        <p className="text-6xl">{country.flag}</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">{country.name}</h2>
        <p className="mt-1 text-sm text-slate-400">What do you know about this country?</p>
      </div>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="mt-5 rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 active:scale-95"
        >
          Reveal
        </button>
      ) : (
        <div className="mt-6 space-y-4">
          {/* Key facts grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            <FactBox label="Capital" value={country.capital} highlight />
            <FactBox label="Languages" value={country.languages} />
            {country.population && <FactBox label="Population" value={country.population} />}
            {country.currency && <FactBox label="Currency" value={country.currency} />}
          </div>

          {/* National food */}
          {country.nationalFood && (
            <div className="rounded-3xl border border-amber-400/15 bg-amber-400/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-300">National food</p>
              <p className="mt-2 text-sm leading-6 text-slate-100">{country.nationalFood}</p>
            </div>
          )}

          {/* Phrases */}
          {(country.phraseHi || country.phraseMorning || country.phraseAfternoon) && (
            <div className="rounded-3xl border border-sky-400/15 bg-sky-400/5 p-4 space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-sky-300">
                Phrases{country.phraseLanguage ? ` in ${country.phraseLanguage}` : ""}
              </p>
              <div className="space-y-2">
                {country.phraseHi && (
                  <PhraseRow emoji="👋" label="Hi" value={country.phraseHi} />
                )}
                {country.phraseMorning && (
                  <PhraseRow emoji="🌅" label="Good morning" value={country.phraseMorning} />
                )}
                {country.phraseAfternoon && (
                  <PhraseRow emoji="☀️" label="Good afternoon" value={country.phraseAfternoon} />
                )}
              </div>
            </div>
          )}

          {/* Fun fact */}
          {country.funFact && (
            <div className="rounded-3xl border border-violet-400/15 bg-violet-400/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-violet-300">Fun fact</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">{country.funFact}</p>
            </div>
          )}

          {/* Grade */}
          <div className="space-y-3 rounded-3xl border border-white/8 bg-slate-950/60 p-4">
            <p className="text-sm font-medium text-slate-300">How well did you know it?</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {GRADES.map(({ value, label, style }) => {
                const isThis = pendingGrade === value && isPending;
                return (
                  <button
                    key={value}
                    onClick={() => handleGrade(value)}
                    disabled={isPending}
                    className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-sm font-semibold transition ${style} ${isPending ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    {isThis ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <span className="text-base">{value}</span>
                    )}
                    <span className="text-[10px] font-normal opacity-70">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FactBox({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-3xl border p-4 ${highlight ? "border-emerald-300/20 bg-emerald-400/5" : "border-white/8 bg-white/[0.02]"}`}>
      <p className={`text-xs uppercase tracking-[0.2em] ${highlight ? "text-emerald-300" : "text-slate-500"}`}>{label}</p>
      <p className="mt-1.5 text-sm font-medium text-slate-100">{value}</p>
    </div>
  );
}

function PhraseRow({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <div className="flex gap-3 text-sm">
      <span className="w-5 shrink-0 text-center">{emoji}</span>
      <span className="w-28 shrink-0 text-slate-400">{label}</span>
      <span className="text-slate-100">{value}</span>
    </div>
  );
}
