export const dynamic = "force-dynamic";

import { AppShell } from "@/components/app-shell";
import { CountryCard } from "@/components/country-card";
import { gradeCountry } from "./actions";
import { prisma } from "@/lib/prisma";

const MAX_NEW = 1;

export default async function CountriesPage() {
  const now = new Date();

  const allDue = await prisma.country.findMany({
    where: { dueAt: { lte: now } },
    orderBy: [{ dueAt: "asc" }],
  });

  const reviews = allDue.filter((c) => c.repetitions > 0);
  const newCards = allDue.filter((c) => c.repetitions === 0);
  const shownNew = newCards.slice(0, MAX_NEW);
  const shown = [...reviews, ...shownNew];

  const totalIntroduced = await prisma.country.count({ where: { repetitions: { gt: 0 } } });
  const totalMastered = await prisma.country.count({ where: { interval: { gte: 21 } } });
  const totalCountries = await prisma.country.count();

  const continents = ["Africa", "Americas", "Asia", "Middle East", "Europe", "Oceania"];

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <p className="text-sm font-medium text-emerald-300">Countries of the world</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {shown.length > 0 ? "Today's countries" : "All done for today."}
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {shown.length > 0
              ? "Recall what you know, reveal the details, and grade yourself. One new country arrives each day."
              : "You have no countries due right now. A new one arrives tomorrow."}
          </p>
          {shown.length > 0 && (
            <p className="mt-3 text-xs text-slate-500">
              {reviews.length > 0 && `${reviews.length} review${reviews.length !== 1 ? "s" : ""}`}
              {reviews.length > 0 && shownNew.length > 0 && " · "}
              {shownNew.length > 0 && `${shownNew.length} new`}
            </p>
          )}
        </section>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Introduced" value={totalIntroduced} color="text-emerald-300" />
          <StatCard label="Mastered" value={totalMastered} color="text-violet-300" />
          <StatCard label="Remaining" value={totalCountries - totalIntroduced} color="text-slate-300" />
        </div>

        {/* Cards */}
        {shown.length === 0 ? (
          <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-400/8 p-10 text-center">
            <p className="text-4xl">🌍</p>
            <p className="mt-4 text-xl font-semibold text-white">All clear for today.</p>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-400">
              {totalIntroduced} countries introduced so far. Come back tomorrow for the next one.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {shown.map((country) => (
              <CountryCard
                key={country.id}
                country={country}
                onGrade={gradeCountry}
              />
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="rounded-[2rem] border border-white/8 bg-white/[0.02] p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Continents</p>
          <div className="flex flex-wrap gap-2">
            {continents.map((c) => (
              <span key={c} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 text-center">
      <p className={`text-2xl font-bold tabular-nums ${color}`}>{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-500">{label}</p>
    </div>
  );
}
