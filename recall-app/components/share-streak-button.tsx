"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export function ShareStreakButton({ currentStreak, perfect }: { currentStreak: number; perfect: boolean }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const text = `🔥 ${currentStreak}-day streak on Soro Soke${perfect ? " — perfect, no freezes used!" : "!"}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        // User cancelled the share sheet — not an error worth surfacing.
      }
      return;
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard access denied — silently no-op, nothing to recover.
      }
    }
  }

  return (
    <button
      onClick={share}
      className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Share"}
    </button>
  );
}
