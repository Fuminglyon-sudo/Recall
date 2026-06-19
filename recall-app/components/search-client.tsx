"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { getMastery, MASTERY } from "@/lib/mastery";

type SearchResult = {
  id: string;
  front: string;
  back: string;
  partOfSpeech: string | null;
  example: string | null;
  hook: string | null;
  synonyms: string | null;
  interval: number;
  repetitions: number;
  deckId: string;
  deckName: string;
};

export function SearchClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = (await res.json()) as SearchResult[];
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        {loading ? (
          <span className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
        ) : (
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          placeholder="Search any word, definition, or example…"
          className="input-base pl-10"
        />
      </div>

      {/* Status line */}
      {query.trim().length >= 2 && !loading ? (
        <p className="text-sm text-slate-500">
          {results.length === 0
            ? `No results for "${query}"`
            : `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`}
        </p>
      ) : query.trim().length > 0 && query.trim().length < 2 ? (
        <p className="text-sm text-slate-600">Type at least 2 characters to search.</p>
      ) : null}

      {/* Results */}
      <div className="space-y-2">
        {results.map((card) => {
          const level = getMastery(card.interval, card.repetitions);
          const meta = MASTERY[level];
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
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] text-slate-400">
                      {card.partOfSpeech}
                    </span>
                  ) : null}
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${meta.bg} ${meta.border} ${meta.color}`}>
                    {meta.label}
                  </span>
                </div>
                <span className="shrink-0 text-xs text-slate-600">{card.deckName}</span>
              </button>

              {isOpen ? (
                <div className="space-y-3 border-t border-white/8 px-5 pb-5 pt-4">
                  <p className="text-sm leading-7 text-slate-200">{card.back}</p>
                  {card.example ? (
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Example</p>
                      <p className="text-sm leading-6 italic text-slate-300">{card.example}</p>
                    </div>
                  ) : null}
                  {card.hook ? (
                    <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/5 px-4 py-3">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-emerald-400">Remember it</p>
                      <p className="text-sm leading-6 text-slate-300">{card.hook}</p>
                    </div>
                  ) : null}
                  <Link
                    href={`/decks/${card.deckId}`}
                    className="inline-block text-xs text-emerald-400 transition hover:text-emerald-300"
                  >
                    Open in {card.deckName} →
                  </Link>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
