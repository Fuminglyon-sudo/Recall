export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Presentation } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";
import { getCurrentUserId, scopedUserId } from "@/lib/session";
import { TOPIC_LABELS, type DocTopic } from "@/lib/doc-review-samples";

export const metadata = { title: "Doc Lab History — Soro Soke" };

type HistoryRow = {
  id: string;
  createdAt: Date;
  docTitle: string;
  docTopic: string | null;
  isOwnDoc: boolean;
  mode: "commenter" | "presenter";
  score: number | null; // null = analysis-only commenter run, never true for presenter
};

export default async function DocLabHistoryPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");
  const uid = scopedUserId(userId);

  const [reviewSessions, presenterSessions] = await Promise.all([
    prisma.docReviewSession.findMany({
      where: { userId: uid },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        createdAt: true,
        docTitle: true,
        docTopic: true,
        isOwnDoc: true,
        attempted: true,
        detectionScore: true,
      },
    }),
    prisma.docPresenterSession.findMany({
      where: { userId: uid },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        createdAt: true,
        docTitle: true,
        docTopic: true,
        isOwnDoc: true,
        overallScore: true,
      },
    }),
  ]);

  // Only graded commenter attempts belong in the average and the trend —
  // runs where the user skipped straight to the analysis were never scored,
  // and presenter-mode scores aren't the same metric, so they're kept in a
  // combined list below but out of this specific trend.
  const scored = reviewSessions.filter((s) => s.attempted);
  const avg =
    scored.length > 0
      ? Math.round(scored.reduce((sum, s) => sum + s.detectionScore, 0) / scored.length)
      : null;

  const combined: HistoryRow[] = [
    ...reviewSessions.map((s) => ({
      id: s.id,
      createdAt: s.createdAt,
      docTitle: s.docTitle,
      docTopic: s.docTopic,
      isOwnDoc: s.isOwnDoc,
      mode: "commenter" as const,
      score: s.attempted ? s.detectionScore : null,
    })),
    ...presenterSessions.map((s) => ({
      id: s.id,
      createdAt: s.createdAt,
      docTitle: s.docTitle,
      docTopic: s.docTopic,
      isOwnDoc: s.isOwnDoc,
      mode: "presenter" as const,
      score: s.overallScore,
    })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 50);

  return (
    <AppShell>
      <section className="mx-auto max-w-2xl space-y-6">
        <Link href="/doc-lab" className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to Doc Lab
        </Link>

        <div>
          <p className="text-sm font-medium text-emerald-300">Session history</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Documents you have read closely</h1>
          {avg !== null ? (
            <p className="mt-1 text-sm text-slate-400">
              {scored.length} graded commenter attempt{scored.length !== 1 ? "s" : ""} · average{" "}
              <span className="font-semibold text-white">{avg}/10</span>
            </p>
          ) : (
            <p className="mt-1 text-sm text-slate-400">
              Commit to what you would raise before revealing the analysis — that is what gets scored here.
            </p>
          )}
        </div>

        {/* Score trend — graded commenter-mode attempts only; presenter mode
            scores a different thing (summary + follow-up), so it's shown in
            the list below but kept out of this specific trend. */}
        {scored.length >= 3 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
            <p className="mb-4 text-xs uppercase tracking-[0.18em] text-slate-500">Detection trend (commenter mode)</p>
            <div className="flex h-14 items-end gap-1">
              {[...scored]
                .reverse()
                .slice(-20)
                .map((s) => (
                  <div key={s.id} className="flex flex-1 flex-col items-center">
                    <div
                      className={`min-h-[2px] w-full rounded-sm ${
                        s.detectionScore >= 7
                          ? "bg-emerald-400"
                          : s.detectionScore >= 4
                          ? "bg-amber-400"
                          : "bg-rose-400"
                      }`}
                      style={{ height: `${(s.detectionScore / 10) * 100}%` }}
                      title={`${s.detectionScore}/10 — ${s.docTitle}`}
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

        {/* Session list — both modes, most recent first */}
        <div className="space-y-3">
          {combined.length === 0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-sm text-slate-400">
                Nothing here yet. Read a document in Doc Lab and it will show up.
              </p>
              <Link
                href="/doc-lab"
                className="mt-4 inline-block text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
              >
                Open Doc Lab →
              </Link>
            </div>
          ) : (
            combined.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{s.docTitle}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-slate-500">
                    <span
                      className={`inline-flex items-center gap-1 ${
                        s.mode === "presenter" ? "text-violet-300/80" : "text-slate-500"
                      }`}
                    >
                      {s.mode === "presenter" ? <Presentation className="h-3 w-3" /> : null}
                      {s.mode === "presenter" ? "Presenter" : "Commenter"}
                    </span>
                    <span>·</span>
                    {s.isOwnDoc ? (
                      <span className="inline-flex items-center gap-1 text-emerald-300/80">
                        <FileText className="h-3 w-3" /> Your document
                      </span>
                    ) : (
                      <span>{TOPIC_LABELS[s.docTopic as DocTopic] ?? "Practice"}</span>
                    )}
                    {s.mode === "commenter" && s.score === null ? <span>· analysis only</span> : null}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-600">
                    {new Date(s.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {s.score !== null ? (
                  <div
                    className={`shrink-0 text-2xl font-bold tabular-nums ${
                      s.score >= 7 ? "text-emerald-300" : s.score >= 4 ? "text-amber-300" : "text-rose-300"
                    }`}
                  >
                    {s.score}
                    <span className="text-sm text-slate-600">/10</span>
                  </div>
                ) : (
                  <span className="shrink-0 text-xs text-slate-600">—</span>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </AppShell>
  );
}
