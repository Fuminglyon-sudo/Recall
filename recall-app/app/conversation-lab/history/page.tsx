export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";
import { getCurrentUserId, scopedUserId } from "@/lib/session";

export const metadata = { title: "Conversation Lab History — Soro Soke" };

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Warm-up",
  medium: "Moderate",
  hard: "Challenging",
};

export default async function ConversationLabHistoryPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");
  const uid = scopedUserId(userId);

  const sessions = await prisma.socialSession.findMany({
    where: { userId: uid ?? undefined },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      createdAt: true,
      scenarioTag: true,
      scenarioEmoji: true,
      characterLabel: true,
      difficulty: true,
      score: true,
      practiceGoal: true,
      exchangeCount: true,
    },
  });

  const avg =
    sessions.length > 0
      ? Math.round(sessions.reduce((s, x) => s + x.score, 0) / sessions.length)
      : null;

  return (
    <AppShell>
      <section className="max-w-2xl space-y-6">
        <Link
          href="/conversation-lab"
          className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Conversation Lab
        </Link>

        <div>
          <p className="text-sm font-medium text-emerald-300">Session history</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Your Conversation Lab sessions</h1>
          {avg !== null ? (
            <p className="mt-1 text-sm text-slate-400">
              {sessions.length} session{sessions.length !== 1 ? "s" : ""} · average score{" "}
              <span className="font-semibold text-white">{avg}/10</span>
            </p>
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
                      title={`${s.score}/10 — ${s.scenarioTag}`}
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
                No sessions saved yet. Complete a Conversation Lab session to see your history here.
              </p>
              <Link
                href="/conversation-lab"
                className="mt-4 inline-block text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
              >
                Start a session →
              </Link>
            </div>
          ) : (
            sessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-white">
                    <span>{s.scenarioEmoji}</span>
                    {s.scenarioTag}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {s.characterLabel} · {DIFFICULTY_LABELS[s.difficulty] ?? s.difficulty}
                    {s.practiceGoal ? ` · ${s.practiceGoal}` : ""}
                    {" · "}{s.exchangeCount} exchange{s.exchangeCount !== 1 ? "s" : ""}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-600">
                    {new Date(s.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div
                  className={`shrink-0 text-2xl font-bold tabular-nums ${
                    s.score >= 8
                      ? "text-emerald-300"
                      : s.score >= 5
                      ? "text-amber-300"
                      : "text-rose-300"
                  }`}
                >
                  {s.score}
                  <span className="text-sm font-normal text-slate-500">/10</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </AppShell>
  );
}
