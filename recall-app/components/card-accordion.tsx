"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MasteryBadge } from "./mastery-badge";
import { SubmitButton } from "./forms";
import { MASTERY, getMastery } from "@/lib/mastery";

export type CardRow = {
  id: string;
  front: string;
  back: string;
  partOfSpeech: string | null;
  example: string | null;
  hook: string | null;
  synonyms: string | null;
  sourceContext: string | null;
  interval: number;
  repetitions: number;
  easeFactor: number;
  dueAt: string;
};

export function CardAccordion({
  cards,
  deckId,
  updateCardAction,
  resetCardAction,
}: {
  cards: CardRow[];
  deckId: string;
  updateCardAction: (formData: FormData) => void;
  resetCardAction?: (formData: FormData) => void;
}) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [showStrugglingOnly, setShowStrugglingOnly] = useState(false);

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const strugglingCount = cards.filter((c) => c.easeFactor < 2.0 && c.repetitions > 0).length;
  const shownCards = showStrugglingOnly && strugglingCount > 0 ? cards.filter((c) => c.easeFactor < 2.0 && c.repetitions > 0) : cards;

  return (
    <div className="space-y-4">
      {strugglingCount > 0 ? (
        <div className="rounded-[2rem] border border-amber-400/25 bg-amber-400/8 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-amber-300">
                {strugglingCount} card{strugglingCount === 1 ? "" : "s"} not sticking yet
              </p>
              <p className="mt-1 text-sm leading-6 text-amber-200/70">
                These keep coming back. They&apos;ve been graded poorly several times and their ease factor has dropped below 2.0. You can reset any struggling card to start fresh.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowStrugglingOnly((v) => !v)}
              className="shrink-0 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-400/20"
            >
              {showStrugglingOnly ? "Show all cards" : "Show struggling cards"}
            </button>
          </div>
        </div>
      ) : null}
      <div className="space-y-2">
      {shownCards.map((card) => {
        const isOpen = openIds.has(card.id);
        const mastery = getMastery(card.interval, card.repetitions);
        const meta = MASTERY[mastery];
        const isStruggling = card.easeFactor < 2.0 && card.repetitions > 0;

        return (
          <div key={card.id} className={`overflow-hidden rounded-[2rem] border transition-colors ${isOpen ? "border-white/15 bg-white/5" : "border-white/8 bg-white/[0.03] hover:border-white/12 hover:bg-white/[0.05]"} backdrop-blur`}>
            {/* Collapsed header — always visible */}
            <button
              type="button"
              onClick={() => toggle(card.id)}
              className="flex w-full items-center gap-4 px-5 py-4 text-left"
            >
              <span className={`h-2 w-2 shrink-0 rounded-full ${meta.bar}`} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-white">{card.front}</span>
                {!isOpen && card.back ? (
                  <span className="mt-0.5 block truncate text-xs text-slate-500">{card.back}</span>
                ) : null}
              </span>
              <div className="flex shrink-0 items-center gap-2">
                {isStruggling ? (
                  <span className="hidden rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300 sm:inline">
                    Struggling
                  </span>
                ) : null}
                {card.partOfSpeech ? (
                  <span className="hidden rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2.5 py-0.5 text-xs font-medium text-emerald-200 sm:inline">
                    {card.partOfSpeech}
                  </span>
                ) : null}
                <MasteryBadge interval={card.interval} repetitions={card.repetitions} />
                {isOpen
                  ? <ChevronUp className="h-4 w-4 text-slate-500" />
                  : <ChevronDown className="h-4 w-4 text-slate-500" />}
              </div>
            </button>

            {/* Expanded body */}
            {isOpen ? (
              <div className="border-t border-white/8 px-5 pb-6 pt-5">
                {/* Preview */}
                <div className="mb-5 rounded-3xl border border-emerald-300/15 bg-slate-950/60 p-5">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <PreviewBlock label="Definition" value={card.back} className="lg:col-span-2" />
                    {card.example ? <PreviewBlock label="Example" value={card.example} /> : null}
                    {card.hook ? <PreviewBlock label="Memory hook" value={card.hook} /> : null}
                    {card.synonyms ? <PreviewTags label="Synonyms" value={card.synonyms} /> : null}
                    {card.sourceContext ? <PreviewBlock label="Source context" value={card.sourceContext} /> : null}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <MetaPill label={`Due ${new Date(card.dueAt).toLocaleDateString()}`} />
                    <MetaPill label={`Interval ${card.interval} day${card.interval === 1 ? "" : "s"}`} />
                    <MetaPill label={`Ease ${card.easeFactor.toFixed(2)}`} />
                  </div>
                </div>

                {/* Edit form */}
                <p className="mb-4 text-xs uppercase tracking-[0.24em] text-slate-500">Edit card</p>
                <form action={updateCardAction} className="space-y-4">
                  <input type="hidden" name="cardId" value={card.id} />
                  <input type="hidden" name="deckId" value={deckId} />

                  <div className="grid gap-4 lg:grid-cols-2">
                    <Field label="Front">
                      <input name="front" defaultValue={card.front} className="input-base" required />
                    </Field>
                    <Field label="Part of speech">
                      <input name="partOfSpeech" defaultValue={card.partOfSpeech ?? ""} className="input-base" />
                    </Field>
                  </div>

                  <Field label="Back">
                    <textarea name="back" defaultValue={card.back} rows={4} className="input-base" required />
                  </Field>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <Field label="Example">
                      <textarea name="example" defaultValue={card.example ?? ""} rows={3} className="input-base" />
                    </Field>
                    <Field label="Memory hook">
                      <textarea name="hook" defaultValue={card.hook ?? ""} rows={3} className="input-base" />
                    </Field>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <Field label="Synonyms">
                      <input name="synonyms" defaultValue={card.synonyms ?? ""} className="input-base" />
                    </Field>
                    <Field label="Source context">
                      <textarea name="sourceContext" defaultValue={card.sourceContext ?? ""} rows={3} className="input-base" />
                    </Field>
                  </div>

                  <div className="flex justify-end">
                    <SubmitButton label="Save edits" pendingLabel="Saving…" />
                  </div>
                </form>

                {resetCardAction && isStruggling ? (
                  <form action={resetCardAction} className="mt-4 border-t border-white/8 pt-4">
                    <input type="hidden" name="cardId" value={card.id} />
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium text-amber-300">Reset progress</p>
                        <p className="mt-0.5 text-xs leading-5 text-slate-500">
                          Start this card fresh. Clears interval, ease factor, and repetitions.
                        </p>
                      </div>
                      <button
                        type="submit"
                        className="shrink-0 rounded-2xl border border-amber-400/25 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-400/20"
                      >
                        Reset
                      </button>
                    </div>
                  </form>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2 rounded-3xl border border-white/8 bg-slate-950/35 p-4">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      {children}
    </label>
  );
}

function PreviewBlock({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`rounded-3xl border border-white/8 bg-white/[0.03] p-4 ${className}`}>
      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm leading-7 text-slate-100">{value}</p>
    </div>
  );
}

function PreviewTags({ label, value }: { label: string; value: string }) {
  const tags = value.split(",").map((s) => s.trim()).filter(Boolean);
  if (tags.length === 0) return null;
  return (
    <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200">{tag}</span>
        ))}
      </div>
    </div>
  );
}

function MetaPill({ label }: { label: string }) {
  return <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">{label}</span>;
}
