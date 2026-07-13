"use client";

import { useMemo, useState } from "react";

type Deck = {
  id: string;
  name: string;
  description: string | null;
};

export function DraftCardForm({
  decks,
  createCardAction,
  initialFront = "",
  initialBack = "",
  submitButton,
}: {
  decks: Deck[];
  createCardAction: (formData: FormData) => void;
  initialFront?: string;
  initialBack?: string;
  submitButton: React.ReactNode;
}) {
  const [front, setFront] = useState(initialFront);
  const [deckId, setDeckId] = useState(decks[0]?.id ?? "");
  const [back, setBack] = useState(initialBack);
  const [partOfSpeech, setPartOfSpeech] = useState("");
  const [example, setExample] = useState("");
  const [hook, setHook] = useState("");
  const [synonyms, setSynonyms] = useState("");
  const [sourceContext, setSourceContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);

  const selectedDeck = useMemo(() => decks.find((deck) => deck.id === deckId), [deckId, decks]);
  const kind = selectedDeck?.name === "People I care about" ? "MEMORY" : selectedDeck?.name === "Founder Vocabulary" ? "FOUNDER" : "VOCABULARY";

  async function generateDraft() {
    if (!front.trim() || !deckId) return;
    setLoading(true);
    setDraftError(null);
    try {
      const response = await fetch("/api/ai-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ front, deckId }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        setDraftError(body.error ?? "Draft failed. Try again.");
        return;
      }
      const draft = await response.json();
      setBack(draft.definition ?? "");
      setPartOfSpeech(draft.partOfSpeech ?? "");
      setExample(draft.example ?? "");
      setHook(draft.hook ?? "");
      setSynonyms(Array.isArray(draft.synonyms) ? draft.synonyms.join(", ") : "");
    } catch {
      setDraftError("Something went wrong. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={createCardAction} className="space-y-5">
      <input type="hidden" name="kind" value={kind} />
      <Field label="Deck">
        <select name="deckId" value={deckId} onChange={(event) => setDeckId(event.target.value)} className="input-base">
          {decks.map((deck) => (
            <option key={deck.id} value={deck.id}>{deck.name}</option>
          ))}
        </select>
      </Field>
      <Field label="Front">
        <input name="front" value={front} onChange={(event) => setFront(event.target.value)} placeholder="Word, phrase, person, or idea" className="input-base" required />
      </Field>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={generateDraft} disabled={loading || !front.trim() || !deckId} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Drafting with Claude..." : "Generate draft"}
        </button>
        <p className="self-center text-sm text-slate-400">Claude drafts the definition, example, hook, and simple synonyms for you to edit.</p>
      </div>
      {draftError && (
        <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm text-red-300">{draftError}</p>
      )}
      <Field label="Definition / back">
        <textarea name="back" value={back} onChange={(event) => setBack(event.target.value)} rows={4} className="input-base min-h-28" required />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Part of speech"><input name="partOfSpeech" value={partOfSpeech} onChange={(event) => setPartOfSpeech(event.target.value)} className="input-base" /></Field>
        <Field label="Synonyms"><input name="synonyms" value={synonyms} onChange={(event) => setSynonyms(event.target.value)} className="input-base" /></Field>
      </div>
      <Field label="Example sentence"><textarea name="example" value={example} onChange={(event) => setExample(event.target.value)} rows={3} className="input-base" /></Field>
      <Field label="Memory hook"><textarea name="hook" value={hook} onChange={(event) => setHook(event.target.value)} rows={3} className="input-base" /></Field>
      <Field label="Source context (optional)"><textarea name="sourceContext" value={sourceContext} onChange={(event) => setSourceContext(event.target.value)} rows={3} placeholder="Where you encountered this term, what it relates to, or the context that made it important." className="input-base" /></Field>
      <div>{submitButton}</div>
    </form>
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
