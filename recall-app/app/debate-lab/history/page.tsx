export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";
import { getCurrentUserId, scopedUserId } from "@/lib/session";

export const metadata = { title: "Debate Lab History — Soro Soke" };

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

function scoreColor(s: number) {
  if (s >= 8) return "text-emerald-300";
  if (s >= 5) return "text-amber-300";
  return "text-rose-300";
}

export default async function DebateLabHistoryPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");
  const uid = scopedUserId(userId);

  const sessions = await prisma.debateSession.findMany({
    where: { userId: uid },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      createdAt: true,
      motion: true,
      position: true,
      opponentType: true,
      difficulty: true,
      exchangeCount: true,
      score: true,
    },
  });

  const avg =
    sessions.length > 0
      ? Math.round(sessions.reduce((s, x) => s + x.score, 0) / sessions.length)
      : null;

  const wins   = sessions.filter((s) => s.score >= 7).length;
  const draws  = sessions.filter((s) => s.score >= 5 && s.score < 7).length;
  const losses = sessions.filter((s) => s.score < 5).length;

  return (
    <AppShell>
      <section className="max-w-2xl space-y-6">
        <Link
          href="/debate-lab"
          className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Debate Lab
        </Link>

        <div>
          <p className="text-sm font-medium text-amber-400">Session history</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Your Debate Lab sessions</h1>
          {avg !== null ? (
            <div className="mt-2 space-y-1">
              <p className="text-sm text-slate-400">
                {sessions.length} session{sessions.length !== 1 ? "s" : ""} · average score{" "}
                <span className="font-semibold text-white">{avg}/10</span>
              </p>
              <div className="flex items-center gap-3 text-xs">
                <span className="font-bold text-emerald-300">{wins}W</span>
                <span className="text-slate-600">·</span>
                <span className="font-bold text-amber-300">{draws}D</span>
                <span className="text-slate-600">·</span>
                <span className="font-bold text-red-300">{losses}L</span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Score trend */}
        {sessions.length >= 3 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
            <p className="mb-4 text-xs uppercase tracking-[0.18em] text-slate-500">Score trend</p>
            <div className="flex h-14 items-end gap-1">
              {[...sessions]
                .reverse()
                .slice(-20)
                .map((s) => (
                  <div key={s.id} className="flex flex-1 flex-col items-center">
                    <div
                      className={`w-full min-h-[2px] rounded-sm ${
                        s.score >= 8
                          ? "bg-emerald-400"
                          : s.score >= 5
                          ? "bg-amber-400"
                          : "bg-rose-400"
                      }`}
                      style={{ height: `${(s.score / 10) * 100}%` }}
                      title={`${s.score}/10 — ${s.motion}`}
                    />
                  </div>
                ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-slate-600">
              <span>Oldest</span>
              <span>Latest</span>
            </div>
          </div>
        ) : null}

        {/* Session list */}
        <div className="space-y-3">
          {sessions.length === 0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-sm text-slate-400">
                No sessions saved yet. Complete a Debate Lab session to see your history here.
              </p>
              <Link
                href="/debate-lab"
                className="mt-4 inline-block text-sm font-semibold text-amber-400 transition hover:text-amber-300"
              >
                Start a debate →
              </Link>
            </div>
          ) : (
            sessions.map((s) => (
              <Link
                key={s.id}
                href={`/debate-lab/history/${s.id}`}
                className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:border-white/20 hover:bg-white/8"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{s.motion}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        s.position === "for"
                          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                          : "border-red-400/30 bg-red-400/10 text-red-300"
                      }`}
                    >
                      {s.position === "for" ? "For" : "Against"}
                    </span>
                    <span className="text-xs text-slate-500">
                      vs {s.opponentType} · {DIFFICULTY_LABELS[s.difficulty] ?? s.difficulty}
                      {" · "}{s.exchangeCount} exchange{s.exchangeCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    {new Date(s.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span className={`text-2xl font-bold tabular-nums ${scoreColor(s.score)}`}>
                    {s.score}<span className="text-sm font-normal text-slate-500">/10</span>
                  </span>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                    s.score >= 7 ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" :
                    s.score >= 5 ? "border-amber-400/30 bg-amber-400/10 text-amber-300" :
                    "border-red-400/30 bg-red-400/10 text-red-300"
                  }`}>
                    {s.score >= 7 ? "Win" : s.score >= 5 ? "Draw" : "Loss"}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </AppShell>
  );
}
