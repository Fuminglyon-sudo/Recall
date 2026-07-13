"use client";

import { useState } from "react";
import { Copy, Check, Link2Off } from "lucide-react";
import { generateShareLink, revokeShareLink } from "@/app/decks/actions";
import { SubmitButton } from "@/components/forms";

export function DeckSharePanel({
  deckId,
  shareToken,
}: {
  deckId: string;
  shareToken: string | null;
}) {
  const [origin] = useState(() => typeof window !== "undefined" ? window.location.origin : "");
  const [copied, setCopied] = useState(false);

  const shareUrl = shareToken ? `${origin}/decks/shared/${shareToken}` : null;

  async function handleCopy() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Share deck</p>

      {shareToken ? (
        <div className="space-y-3">
          <p className="text-xs leading-5 text-slate-400">
            Anyone with this link can preview the cards and clone the deck to their account.
          </p>
          <div className="flex items-center gap-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
            <p className="flex-1 truncate font-mono text-xs text-slate-400">
              {shareUrl || `/decks/shared/${shareToken}`}
            </p>
            <button
              onClick={handleCopy}
              className={`flex shrink-0 items-center gap-1 rounded-xl px-2 py-1 text-xs transition ${
                copied ? "text-emerald-400" : "text-slate-400 hover:text-white"
              }`}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <form action={revokeShareLink}>
            <input type="hidden" name="deckId" value={deckId} />
            <button
              type="submit"
              className="flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-rose-400"
            >
              <Link2Off className="h-3.5 w-3.5" />
              Revoke link
            </button>
          </form>
        </div>
      ) : (
        <div>
          <p className="mb-3 text-xs leading-5 text-slate-500">
            Generate a public link so anyone can preview and clone this deck.
          </p>
          <form action={generateShareLink}>
            <input type="hidden" name="deckId" value={deckId} />
            <SubmitButton label="Generate share link" pendingLabel="Generating…" />
          </form>
        </div>
      )}
    </div>
  );
}
