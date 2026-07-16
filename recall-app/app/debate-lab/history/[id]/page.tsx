export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";
import { getCurrentUserId, scopedUserId } from "@/lib/session";

type Message = { role: "user" | "opponent"; content: string };

function scoreColor(s: number) {
  if (s >= 8) return "text-emerald-300";
  if (s >= 5) return "text-amber-300";
  return "text-rose-300";
}

function scoreBorder(s: number) {
  if (s >= 8) return "border-emerald-400/25 bg-emerald-400/8";
  if (s >= 5) return "border-amber-400/25 bg-amber-400/8";
  return "border-red-400/25 bg-red-400/8";
}

function scoreLabel(s: number) {
  if (s >= 9) return "Masterful debater";
  if (s >= 7) return "Sharp and well-reasoned";
  if (s >= 5) return "Solid foundation";
  if (s >= 3) return "Building the skill";
  return "Needs more work";
}

export default async function DebateSessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");
  const uid = scopedUserId(userId);

  const session = await prisma.debateSession.findFirst({
    where: { id, userId: uid },
    select: {
      id: true,
      createdAt: true,
      motion: true,
      position: true,
      opponentType: true,
      difficulty: true,
      exchangeCount: true,
      score: true,
      strongPoints: true,
      improvements: true,
      keyFallacy: true,
      missedArg: true,
      modelRebuttal: true,
      messages: true,
    },
  });

  if (!session) notFound();

  const messages = (session.messages as unknown as Message[]) ?? [];
  const strongPoints = (session.strongPoints as unknown as string[]) ?? [];
  const improvements = (session.improvements as unknown as string[]) ?? [];

  const DIFFICULTY_LABELS: Record<string, string> = { easy: "Easy", medium: "Medium", hard: "Hard" };

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-5">
        <Link href="/debate-lab/history" className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to history
        </Link>

        {/* Score header */}
        <div className={`rounded-[2rem] border p-5 ${scoreBorder(session.score)}`}>
          <div className="flex flex-wrap items-baseline gap-3">
            <span className={`text-5xl font-bold tabular-nums ${scoreColor(session.score)}`}>{session.score}</span>
            <span className="text-lg text-slate-500">/10</span>
            <span className={`text-sm font-semibold ${scoreColor(session.score)}`}>— {scoreLabel(session.score)}</span>
            <span className={`ml-auto rounded-full border px-3 py-0.5 text-xs font-bold uppercase tracking-widest ${
              session.score >= 7 ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" :
              session.score >= 5 ? "border-amber-400/30 bg-amber-400/10 text-amber-300" :
              "border-red-400/30 bg-red-400/10 text-red-300"
            }`}>
              {session.score >= 7 ? "Win" : session.score >= 5 ? "Draw" : "Loss"}
            </span>
          </div>
          <p className="mt-3 text-sm font-semibold leading-5 text-white">{session.motion}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
              session.position === "for" ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" : "border-red-400/30 bg-red-400/10 text-red-300"
            }`}>
              {session.position === "for" ? "For" : "Against"}
            </span>
            <span>vs {session.opponentType}</span>
            <span>·</span>
            <span>{DIFFICULTY_LABELS[session.difficulty] ?? session.difficulty}</span>
            <span>·</span>
            <span>{session.exchangeCount} exchange{session.exchangeCount !== 1 ? "s" : ""}</span>
            <span>·</span>
            <span>{new Date(session.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
          </div>
        </div>

        {/* Strong points */}
        {strongPoints.length > 0 ? (
          <div className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/5 p-5 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">What landed</p>
            {strongPoints.map((p, i) => <p key={i} className="text-sm leading-6 text-slate-200">{p}</p>)}
          </div>
        ) : null}

        {/* Improvements */}
        {improvements.length > 0 ? (
          <div className="rounded-[2rem] border border-amber-400/20 bg-amber-400/5 p-5 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">What to sharpen</p>
            {improvements.map((p, i) => <p key={i} className="text-sm leading-6 text-slate-200">{p}</p>)}
          </div>
        ) : null}

        {/* Key fallacy */}
        {session.keyFallacy ? (
          <div className="rounded-[2rem] border border-red-400/20 bg-red-400/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-400">Logical fallacy detected</p>
            <p className="mt-2 text-sm leading-6 text-slate-200">{session.keyFallacy}</p>
          </div>
        ) : null}

        {/* Missed argument */}
        <div className="rounded-[2rem] border border-violet-400/20 bg-violet-400/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Argument you missed</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">{session.missedArg}</p>
        </div>

        {/* Model rebuttal */}
        <div className="rounded-[2rem] border border-sky-400/20 bg-sky-400/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-400">How to handle their hardest challenge</p>
          <p className="mt-2 text-sm leading-6 text-slate-200 italic">&ldquo;{session.modelRebuttal}&rdquo;</p>
        </div>

        {/* Full transcript */}
        {messages.length > 0 ? (
          <div className="rounded-[2rem] border border-white/8 bg-white/[0.02] p-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Full transcript</p>
            {messages.map((msg, i) =>
              msg.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[80%] space-y-1">
                    <p className="text-right text-[10px] font-semibold uppercase tracking-widest text-amber-400">You</p>
                    <div className="rounded-2xl rounded-tr-sm border border-amber-400/20 bg-amber-400/8 px-4 py-3">
                      <p className="text-sm leading-6 text-slate-200">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-start">
                  <div className="max-w-[80%] space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{session.opponentType}</p>
                    <div className="rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-4 py-3">
                      <p className="text-sm leading-6 text-slate-300">{msg.content}</p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
