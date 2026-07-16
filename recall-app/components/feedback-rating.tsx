"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

type Kind = "debate" | "speak-up" | "social";
type Rating = "up" | "down" | null;

export function FeedbackRating({ kind, sessionId }: { kind: Kind; sessionId: string | null }) {
  const [rating, setRating] = useState<Rating>(null);
  const [pending, setPending] = useState(false);

  if (!sessionId) return null;

  async function rate(next: Exclude<Rating, null>) {
    if (pending) return;
    const value: Rating = rating === next ? null : next;
    setRating(value);
    setPending(true);
    try {
      await fetch("/api/session-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, sessionId, rating: value }),
      });
    } catch {
      // Non-critical — a failed rating just doesn't stick; no user-facing error needed.
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex items-center gap-2 text-xs text-slate-500">
      <span>Was this feedback fair?</span>
      <button
        type="button"
        onClick={() => rate("up")}
        aria-pressed={rating === "up"}
        aria-label="Feedback felt fair"
        className={`rounded-full border p-1.5 transition ${
          rating === "up"
            ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300"
            : "border-white/10 bg-white/5 text-slate-400 hover:text-slate-200"
        }`}
      >
        <ThumbsUp className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => rate("down")}
        aria-pressed={rating === "down"}
        aria-label="Feedback felt unfair"
        className={`rounded-full border p-1.5 transition ${
          rating === "down"
            ? "border-red-400/40 bg-red-400/15 text-red-300"
            : "border-white/10 bg-white/5 text-slate-400 hover:text-slate-200"
        }`}
      >
        <ThumbsDown className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
