export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";

const COUNTRY_NAMES: Record<string, string> = {
  US: "United States", GB: "United Kingdom", NG: "Nigeria", CA: "Canada",
  DE: "Germany", FR: "France", IN: "India", AU: "Australia", BR: "Brazil",
  ZA: "South Africa", KE: "Kenya", GH: "Ghana", NL: "Netherlands", ES: "Spain",
  IT: "Italy", IE: "Ireland", SE: "Sweden", SG: "Singapore", AE: "United Arab Emirates",
  JP: "Japan",
};

function countryLabel(code: string | null): string {
  if (!code) return "Unknown";
  return COUNTRY_NAMES[code] ?? code;
}

export default async function AnalyticsPage() {
  if (!(await isAdmin())) redirect("/");

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const results = await Promise.all([
    prisma.visitLog.count(),
    prisma.visitLog.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.visitLog.groupBy({
      by: ["country"],
      _count: { _all: true },
      orderBy: { _count: { country: "desc" } },
      take: 20,
    }),
    prisma.visitLog.groupBy({
      by: ["city", "country"],
      where: { city: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { city: "desc" } },
      take: 20,
    }),
  ]).catch(() => null);

  const totalVisits = results?.[0] ?? 0;
  const recentVisits = results?.[1] ?? 0;
  const byCountry = results?.[2] ?? [];
  const byCity = results?.[3] ?? [];

  const uniqueCountries = byCountry.filter((c) => c.country !== null).length;

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <p className="text-sm font-medium text-emerald-300">Visitor analytics</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Where visitors are coming from.</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Coarse location only — resolved by the hosting edge network from each request, no IP addresses stored. Counts every full page load, signed in or not.
          </p>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Total visits</p>
            <p className="mt-2 text-3xl font-bold tabular-nums text-white">{totalVisits.toLocaleString()}</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Last 7 days</p>
            <p className="mt-2 text-3xl font-bold tabular-nums text-white">{recentVisits.toLocaleString()}</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Top countries {uniqueCountries > 0 ? `(${uniqueCountries})` : ""}
          </p>
          {byCountry.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">No visits recorded yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {byCountry.map((row) => {
                const count = row._count._all;
                const pct = totalVisits > 0 ? Math.round((count / totalVisits) * 100) : 0;
                return (
                  <div key={row.country ?? "unknown"}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-200">{countryLabel(row.country)}</span>
                      <span className="tabular-nums text-slate-400">{count.toLocaleString()} · {pct}%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-emerald-400" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Top cities</p>
          {byCity.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">No visits recorded yet.</p>
          ) : (
            <div className="mt-4 space-y-2">
              {byCity.map((row) => (
                <div key={`${row.city}-${row.country}`} className="flex items-center justify-between text-sm">
                  <span className="text-slate-200">
                    {row.city}
                    <span className="ml-1.5 text-slate-500">— {countryLabel(row.country)}</span>
                  </span>
                  <span className="tabular-nums text-slate-400">{row._count._all.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
