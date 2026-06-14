"use client";

import { useMemo, useState } from "react";

type Deck = {
  id: string;
  name: string;
  description: string | null;
};

type SuggestedCard = {
  front: string;
  definition: string;
  partOfSpeech: string;
  example: string;
  hook: string;
  synonyms: string[];
  sourceContext: string;
};

const PRODUCT_OPTIONS = [
  { value: "japa-reality", label: "Japa Reality" },
  { value: "sharpen", label: "Sharpen" },
  { value: "custom", label: "Custom context" },
] as const;

export function FounderBatchGenerator({
  decks,
  saveAction,
}: {
  decks: Deck[];
  saveAction: (formData: FormData) => void;
}) {
  const founderDeck = useMemo(() => decks.find((deck) => deck.name === "Founder Vocabulary") ?? decks[0], [decks]);

  const [deckId, setDeckId] = useState(founderDeck?.id ?? "");
  const [product, setProduct] = useState<(typeof PRODUCT_OPTIONS)[number]["value"]>("japa-reality");
  const [context, setContext] = useState("");
  const [cards, setCards] = useState<SuggestedCard[]>([]);
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateCards() {
    if (!context.trim() || !deckId) return;
    setLoading(true);
    setError(null);
    try {
      const selectedDeck = decks.find((deck) => deck.id === deckId);
      const response = await fetch("/api/founder-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product,
          context,
          deckName: selectedDeck?.name ?? "Founder Vocabulary",
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({})) as { error?: string };
        setError(err.error ?? "Generation failed. Try again.");
        return;
      }

      const data = await response.json() as { cards?: SuggestedCard[] };
      const nextCards: SuggestedCard[] = Array.isArray(data.cards) ? data.cards : [];
      setCards(nextCards);
      setSelected(Object.fromEntries(nextCards.map((_, index) => [index, true])));
    } catch {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function updateCard(index: number, field: keyof SuggestedCard, value: string) {
    setCards((current) =>
      current.map((card, cardIndex) => {
        if (cardIndex !== index) return card;
        if (field === "synonyms") {
          return { ...card, synonyms: value.split(",").map((item) => item.trim()).filter(Boolean) };
        }
        return { ...card, [field]: value } as SuggestedCard;
      })
    );
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
      <p className="text-sm font-medium text-emerald-300">Founder vocabulary lab</p>
      <h2 className="mt-3 text-2xl font-semibold text-white">Generate a small batch of speech-ready cards from your product context.</h2>
      <p className="mt-3 text-sm leading-7 text-slate-300">
        Paste something you want to say better — a pitch, intro, product explanation, or networking summary — and Recall will draft useful founder vocabulary cards for review.
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-200">Target deck</span>
          <select value={deckId} onChange={(event) => setDeckId(event.target.value)} className="input-base">
            {decks.map((deck) => (
              <option key={deck.id} value={deck.id}>{deck.name}</option>
            ))}
          </select>
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-200">Product focus</span>
          <select value={product} onChange={(event) => setProduct(event.target.value as (typeof PRODUCT_OPTIONS)[number]["value"])} className="input-base">
            {PRODUCT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-5 block space-y-2">
        <span className="text-sm font-medium text-slate-200">Founder context</span>
        <textarea value={context} onChange={(event) => setContext(event.target.value)} rows={6} placeholder="Paste a speech draft, product explanation, or the way you want to introduce what you built." className="input-base" />
      </label>

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={generateCards} disabled={loading || !context.trim() || !deckId} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Generating founder cards..." : "Generate founder cards"}
        </button>
        <p className="self-center text-sm text-slate-400">You will get 3 to 5 editable suggestions before anything is saved.</p>
      </div>

      {error ? (
        <div className="mt-3 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      {cards.length > 0 ? (
        <form action={saveAction} className="mt-8 space-y-5">
          {cards.map((card, index) => {
            const isChecked = selected[index] ?? false;
            return (
              <div key={index} className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Suggestion {index + 1}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{card.front || "Untitled"}</p>
                  </div>
                  <label className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-100">
                    <input type="checkbox" checked={isChecked} onChange={(event) => setSelected((current) => ({ ...current, [index]: event.target.checked }))} />
                    Save this one
                  </label>
                </div>

                {isChecked ? <input type="hidden" name={`cards[${index}].deckId`} value={deckId} /> : null}
                {isChecked ? <input type="hidden" name={`cards[${index}].kind`} value="FOUNDER" /> : null}

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <Field label="Front">
                    <input value={card.front} onChange={(event) => updateCard(index, "front", event.target.value)} className="input-base" />
                    {isChecked ? <input type="hidden" name={`cards[${index}].front`} value={card.front} /> : null}
                  </Field>
                  <Field label="Part of speech">
                    <input value={card.partOfSpeech} onChange={(event) => updateCard(index, "partOfSpeech", event.target.value)} className="input-base" />
                    {isChecked ? <input type="hidden" name={`cards[${index}].partOfSpeech`} value={card.partOfSpeech} /> : null}
                  </Field>
                </div>

                <div className="mt-4 grid gap-4">
                  <Field label="Definition">
                    <textarea value={card.definition} onChange={(event) => updateCard(index, "definition", event.target.value)} rows={3} className="input-base" />
                    {isChecked ? <input type="hidden" name={`cards[${index}].back`} value={card.definition} /> : null}
                  </Field>
                  <Field label="Example sentence">
                    <textarea value={card.example} onChange={(event) => updateCard(index, "example", event.target.value)} rows={3} className="input-base" />
                    {isChecked ? <input type="hidden" name={`cards[${index}].example`} value={card.example} /> : null}
                  </Field>
                  <Field label="Memory hook">
                    <textarea value={card.hook} onChange={(event) => updateCard(index, "hook", event.target.value)} rows={3} className="input-base" />
                    {isChecked ? <input type="hidden" name={`cards[${index}].hook`} value={card.hook} /> : null}
                  </Field>
                  <Field label="Synonyms">
                    <input value={card.synonyms.join(", ")} onChange={(event) => updateCard(index, "synonyms", event.target.value)} className="input-base" />
                    {isChecked ? <input type="hidden" name={`cards[${index}].synonyms`} value={card.synonyms.join(", ")} /> : null}
                  </Field>
                  <Field label="Source context">
                    <textarea value={card.sourceContext} onChange={(event) => updateCard(index, "sourceContext", event.target.value)} rows={3} className="input-base" />
                    {isChecked ? <input type="hidden" name={`cards[${index}].sourceContext`} value={card.sourceContext} /> : null}
                  </Field>
                </div>
              </div>
            );
          })}

          <button type="submit" className="rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
            Save selected cards
          </button>
        </form>
      ) : null}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      {children}
    </label>
  );
}
