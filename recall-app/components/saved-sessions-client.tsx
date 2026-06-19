"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

type Msg = { role: "user" | "character"; content: string };

type SavedSession = {
  id: string;
  createdAt: string;
  scenarioTag: string;
  scenarioEmoji: string;
  characterLabel: string;
  difficulty: string;
  exchangeCount: number;
  score: number;
  strongPoints: string[];
  improvements: string[];
  powerMove: string;
  messages: Msg[];
  modelConversation: Msg[] | null;
};

function scoreColor(s: number) {
  if (s >= 8) return "text-emerald-300";
  if (s >= 5) return "text-amber-300";
  return "text-red-300";
}

function scoreBorder(s: number) {
  if (s >= 8) return "border-emerald-400/25 bg-emerald-400/8";
  if (s >= 5) return "border-amber-400/25 bg-amber-400/8";
  return "border-red-400/25 bg-red-400/8";
}

function scoreLabel(s: number) {
  if (s >= 9) return "Natural connector";
  if (s >= 7) return "Confident conversationalist";
  if (s >= 5) return "Getting comfortable";
  if (s >= 3) return "Building the skill";
  return "Needs more practice";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function difficultyLabel(d: string) {
  return d.charAt(0).toUpperCase() + d.slice(1);
}

function SessionCard({ session, onDelete }: { session: SavedSession; onDelete: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Remove this saved session?")) return;
    setDeleting(true);
    await fetch(`/api/social-sessions/${session.id}`, { method: "DELETE" });
    onDelete(session.id);
  }

  return (
    <div className={`rounded-[2rem] border ${scoreBorder(session.score)} overflow-hidden`}>
      {/* Header row */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full p-5 text-left sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">{session.scenarioEmoji}</span>
            <div>
              <p className="text-sm font-semibold text-white">{session.scenarioTag}</p>
              <p className="mt-0.5 text-xs text-slate-400">
                {session.characterLabel} · {difficultyLabel(session.difficulty)} ·{" "}
                {session.exchangeCount} exchange{session.exchangeCount !== 1 ? "s" : ""} ·{" "}
                {formatDate(session.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className={`text-2xl font-bold tabular-nums ${scoreColor(session.score)}`}>
              {session.score}
              <span className="text-sm text-slate-500">/10</span>
            </span>
            {open ? (
              <ChevronUp className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            )}
          </div>
        </div>
      </button>

      {/* Expanded body */}
      {open ? (
        <div className="space-y-4 border-t border-white/8 p-5 sm:p-6">
          {/* Score summary */}
          <p className={`text-sm font-semibold ${scoreColor(session.score)}`}>
            {scoreLabel(session.score)}
          </p>

          {/* What worked / sharpen */}
          <div className="grid gap-3 sm:grid-cols-2">
            {session.strongPoints.length > 0 ? (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-300">
                  What worked
                </p>
                <ul className="mt-2 space-y-1.5">
                  {session.strongPoints.map((pt, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-6 text-slate-200">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {session.improvements.length > 0 ? (
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-300">
                  What to sharpen
                </p>
                <ul className="mt-2 space-y-1.5">
                  {session.improvements.map((pt, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-6 text-slate-200">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {/* Power move */}
          {session.powerMove ? (
            <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/5 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400">
                Power move to try
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-200">{session.powerMove}</p>
            </div>
          ) : null}

          {/* Model conversation */}
          {session.modelConversation && session.modelConversation.length > 0 ? (
            <div className="space-y-2 rounded-2xl border border-violet-300/20 bg-violet-400/5 p-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-violet-300">
                  How it could have gone
                </p>
                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                  A model rewrite showing one natural way this conversation could have flowed.
                </p>
              </div>
              {session.modelConversation.map((msg, i) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={i}
                    className={`rounded-2xl border px-4 py-3 ${
                      isUser
                        ? "border-violet-300/20 bg-violet-400/8"
                        : "border-white/8 bg-white/[0.03]"
                    }`}
                  >
                    <p
                      className={`mb-1.5 text-[10px] font-semibold uppercase tracking-widest ${
                        isUser ? "text-violet-300" : "text-slate-500"
                      }`}
                    >
                      {isUser ? "You (model)" : `Them (${session.characterLabel})`}
                    </p>
                    <p className={`text-sm leading-6 ${isUser ? "font-medium text-white" : "text-slate-300"}`}>
                      {msg.content}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : null}

          {/* Your conversation */}
          <div className="space-y-2 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              Your conversation
            </p>
            {session.messages.map((msg, i) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={i}
                  className={`rounded-2xl border px-4 py-3 ${
                    isUser ? "border-white/8 bg-white/[0.03]" : "border-emerald-300/15 bg-emerald-400/5"
                  }`}
                >
                  <p
                    className={`mb-1.5 text-[10px] font-semibold uppercase tracking-widest ${
                      isUser ? "text-slate-500" : "text-emerald-400"
                    }`}
                  >
                    {isUser ? "You" : `Them (${session.characterLabel})`}
                  </p>
                  <p className={`text-sm leading-6 ${isUser ? "text-slate-300" : "font-medium text-white"}`}>
                    {msg.content}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Delete */}
          <div className="flex justify-end">
            <button
              onClick={() => void handleDelete()}
              disabled={deleting}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs text-slate-500 transition hover:bg-white/5 hover:text-red-400 disabled:opacity-40"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {deleting ? "Removing…" : "Remove"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function SavedSessionsClient() {
  const [sessions, setSessions] = useState<SavedSession[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/social-sessions")
      .then((r) => r.json())
      .then((data) => setSessions(data as SavedSession[]))
      .catch(() => setError("Could not load saved sessions."));
  }, []);

  function handleDelete(id: string) {
    setSessions((prev) => (prev ? prev.filter((s) => s.id !== id) : prev));
  }

  if (!sessions) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:0ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:300ms]" />
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-amber-300">{error}</p>;
  }

  if (sessions.length === 0) {
    return (
      <div className="rounded-[2rem] border border-white/8 bg-white/[0.02] p-10 text-center">
        <p className="text-sm text-slate-400">No saved sessions yet.</p>
        <p className="mt-1 text-xs text-slate-600">
          After finishing a social skills conversation, tap Save to keep it here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">{sessions.length} saved session{sessions.length !== 1 ? "s" : ""}</p>
      {sessions.map((s) => (
        <SessionCard key={s.id} session={s} onDelete={handleDelete} />
      ))}
    </div>
  );
}
