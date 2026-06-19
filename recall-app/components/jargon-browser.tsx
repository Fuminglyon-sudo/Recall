"use client";

import { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

type JargonCard = {
  id: string;
  front: string;
  back: string;
  partOfSpeech: string | null;
  example: string | null;
  hook: string | null;
  synonyms: string | null;
};

export function JargonBrowser({ cards }: { cards: JargonCard[] }) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = query.trim()
    ? cards.filter(
        (c) =>
          c.front.toLowerCase().includes(query.toLowerCase()) ||
          c.back.toLowerCase().includes(query.toLowerCase())
      )
    : cards;

  const sorted = [...filtered].sort((a, b) => a.front.localeCompare(b.front));

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search any term…"
          className="input-base pl-10"
        />
      </div>

      <p className="text-sm text-slate-500">
        {sorted.length} {sorted.length === 1 ? "term" : "terms"}
        {query ? ` matching "${query}"` : ""}
      </p>

      {/* Card list */}
      <div className="space-y-2">
        {sorted.map((card) => {
          const isOpen = openId === card.id;
          return (
            <div
              key={card.id}
              className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : card.id)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-semibold text-white">{card.front}</span>
                  {card.partOfSpeech ? (
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-medium text-slate-400">
                      {card.partOfSpeech}
                    </span>
                  ) : null}
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-slate-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
                )}
              </button>

              {isOpen ? (
                <div className="space-y-4 border-t border-white/8 px-5 pb-6 pt-4">
                  <p className="text-sm leading-7 text-slate-200">{card.back}</p>

                  {card.example ? (
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                        Example
                      </p>
                      <p className="text-sm leading-7 italic text-slate-300">{card.example}</p>
                    </div>
                  ) : null}

                  {card.hook ? (
                    <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/5 px-4 py-3">
                      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-emerald-400">
                        Remember it
                      </p>
                      <p className="text-sm leading-7 text-slate-300">{card.hook}</p>
                    </div>
                  ) : null}

                  {card.synonyms ? (
                    <div className="flex flex-wrap gap-2">
                      {card.synonyms
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400"
                          >
                            {s}
                          </span>
                        ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}

        {sorted.length === 0 ? (
          <div className="rounded-[2rem] border border-white/8 bg-white/[0.02] p-10 text-center">
            <p className="text-sm text-slate-400">No terms match &ldquo;{query}&rdquo;</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
