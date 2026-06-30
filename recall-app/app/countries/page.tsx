export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { CountryCard } from "@/components/country-card";
import { gradeCountry } from "./actions";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, scopedUserId, ADMIN_USER_ID } from "@/lib/session";

const MAX_NEW = 1;

export default async function CountriesPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const now = new Date();
  const continents = ["Africa", "Americas", "Asia", "Middle East", "Europe", "Oceania"];

  // ── Admin: use Country model SM-2 fields directly ────────────────────────
  if (userId === ADMIN_USER_ID) {
    const allDue = await prisma.country.findMany({
      where: { dueAt: { lte: now } },
      orderBy: [{ dueAt: "asc" }],
    });
    const reviews = allDue.filter((c) => c.repetitions > 0);
    const newCards = allDue.filter((c) => c.repetitions === 0);
    const shownNew = newCards.slice(0, MAX_NEW);
    const shown = [...reviews, ...shownNew];

    const [totalIntroduced, totalMastered, totalCountries] = await Promise.all([
      prisma.country.count({ where: { repetitions: { gt: 0 } } }),
      prisma.country.count({ where: { interval: { gte: 21 } } }),
      prisma.country.count(),
    ]);

    return (
      <CountriesLayout
        shown={shown}
        totalIntroduced={totalIntroduced}
        totalMastered={totalMastered}
        totalRemaining={totalCountries - totalIntroduced}
        continents={continents}
        onGrade={gradeCountry}
      />
    );
  }

  // ── Google user: per-user progress via UserCountryProgress ───────────────
  const uid = scopedUserId(userId)!; // guaranteed non-null for non-admin

  // Reviews: already started, now due
  const dueProgress = await prisma.userCountryProgress.findMany({
    where: { userId: uid, repetitions: { gt: 0 }, dueAt: { lte: now } },
    include: { country: true },
    orderBy: [{ dueAt: "asc" }],
  });

  // Find next unstarted country (ordered by creation = seeding order)
  const startedIds = await prisma.userCountryProgress.findMany({
    where: { userId: uid },
    select: { countryId: true },
  });
  const startedSet = new Set(startedIds.map((p) => p.countryId));

  const nextNewCountry = await prisma.country.findFirst({
    where: startedSet.size > 0 ? { id: { notIn: [...startedSet] } } : {},
    orderBy: { createdAt: "asc" },
  });

  // Overlay SM-2 state from Country for display shape compatibility
  const reviews = dueProgress.map((p) => ({
    ...p.country,
    easeFactor: p.easeFactor,
    interval: p.interval,
    repetitions: p.repetitions,
    dueAt: p.dueAt,
  }));

  const newCards = nextNewCountry ? [nextNewCountry] : [];
  const shown = [...reviews, ...newCards];

  const [totalIntroduced, totalMastered, totalCountries] = await Promise.all([
    prisma.userCountryProgress.count({ where: { userId: uid } }),
    prisma.userCountryProgress.count({ where: { userId: uid, interval: { gte: 21 } } }),
    prisma.country.count(),
  ]);

  return (
    <CountriesLayout
      shown={shown}
      totalIntroduced={totalIntroduced}
      totalMastered={totalMastered}
      totalRemaining={totalCountries - totalIntroduced}
      continents={continents}
      onGrade={gradeCountry}
    />
  );
}

type CountryLike = {
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
  easeFactor: number;
  interval: number;
  repetitions: number;
  dueAt: Date;
};

function CountriesLayout({
  shown,
  totalIntroduced,
  totalMastered,
  totalRemaining,
  continents,
  onGrade,
}: {
  shown: CountryLike[];
  totalIntroduced: number;
  totalMastered: number;
  totalRemaining: number;
  continents: string[];
  onGrade: (formData: FormData) => Promise<void>;
}) {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
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
              {shown.filter((c) => c.repetitions > 0).length > 0 &&
                `${shown.filter((c) => c.repetitions > 0).length} review${shown.filter((c) => c.repetitions > 0).length !== 1 ? "s" : ""}`}
              {shown.filter((c) => c.repetitions > 0).length > 0 && shown.filter((c) => c.repetitions === 0).length > 0 && " · "}
              {shown.filter((c) => c.repetitions === 0).length > 0 && `${shown.filter((c) => c.repetitions === 0).length} new`}
            </p>
          )}
        </section>

        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Introduced" value={totalIntroduced} color="text-emerald-300" />
          <StatCard label="Mastered" value={totalMastered} color="text-violet-300" />
          <StatCard label="Remaining" value={totalRemaining} color="text-slate-300" />
        </div>

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
              <CountryCard key={country.id} country={country} onGrade={onGrade} />
            ))}
          </div>
        )}

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
