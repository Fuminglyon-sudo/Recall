import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";
import { SubmitButton } from "@/components/forms";
import { MasteryBadge } from "@/components/mastery-badge";
import { computeDistribution, getMastery, MASTERY } from "@/lib/mastery";
import { updateCard } from "../actions";

export default async function DeckDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deck = await prisma.deck.findUnique({
    where: { id },
    include: {
      cards: { orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }] },
    },
  });

  if (!deck) notFound();

  const dist = computeDistribution(deck.cards);
  const total = deck.cards.length || 1;

  return (
    <AppShell>
      <section className="space-y-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <p className="text-sm font-medium text-emerald-300">{deck.name}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">{deck.description ?? "Cards you want to revisit without pressure."}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">{deck.cards.length} cards in this deck. Edit anything when your understanding gets sharper.</p>

          {deck.cards.length > 0 ? (
            <div className="mt-5">
              <div className="flex h-2 w-full overflow-hidden rounded-full bg-white/5">
                {(["new", "learning", "familiar", "mastered"] as const).map((lvl) => {
                  const pct = (dist[lvl] / total) * 100;
                  if (pct === 0) return null;
                  return <div key={lvl} className={`h-full ${MASTERY[lvl].bar}`} style={{ width: `${pct}%` }} title={`${MASTERY[lvl].label}: ${dist[lvl]}`} />;
                })}
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                {(["new", "learning", "familiar", "mastered"] as const).filter((lvl) => dist[lvl] > 0).map((lvl) => (
                  <span key={lvl} className="flex items-center gap-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${MASTERY[lvl].bar}`} />
                    {dist[lvl]} {MASTERY[lvl].label.toLowerCase()}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          {deck.cards.map((card) => (
            <form key={card.id} action={updateCard} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <input type="hidden" name="cardId" value={card.id} />
              <input type="hidden" name="deckId" value={deck.id} />
              <div className="mb-6 rounded-3xl border border-emerald-300/15 bg-slate-950/60 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Preview</p>
                    <h2 className="mt-2 text-xl font-semibold text-white">{card.front}</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <MasteryBadge interval={card.interval} repetitions={card.repetitions} />
                    {card.partOfSpeech ? (
                      <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                        {card.partOfSpeech}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <PreviewBlock label="Definition" value={card.back} className="lg:col-span-2" />
                  {card.example ? <PreviewBlock label="Example" value={card.example} /> : null}
                  {card.hook ? <PreviewBlock label="Memory hook" value={card.hook} /> : null}
                  {card.synonyms ? <PreviewTags label="Synonyms" value={card.synonyms} /> : null}
                  {card.sourceContext ? <PreviewBlock label="Source context" value={card.sourceContext} /> : null}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <MetaPill label={`Due ${card.dueAt.toLocaleDateString()}`} />
                  <MetaPill label={`Interval ${card.interval} day${card.interval === 1 ? "" : "s"}`} />
                  <MetaPill label={`Ease ${card.easeFactor.toFixed(2)}`} />
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Edit card</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">Update the saved wording below. The formatted preview above helps you see how the card reads at a glance.</p>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <label className="block space-y-2 rounded-3xl border border-white/8 bg-slate-950/35 p-4">
                  <span className="text-sm font-medium text-slate-200">Front</span>
                  <input name="front" defaultValue={card.front} className="input-base" required />
                </label>
                <label className="block space-y-2 rounded-3xl border border-white/8 bg-slate-950/35 p-4">
                  <span className="text-sm font-medium text-slate-200">Part of speech</span>
                  <input name="partOfSpeech" defaultValue={card.partOfSpeech ?? ""} className="input-base" />
                </label>
              </div>

              <label className="mt-5 block space-y-2 rounded-3xl border border-white/8 bg-slate-950/35 p-4">
                <span className="text-sm font-medium text-slate-200">Back</span>
                <textarea name="back" defaultValue={card.back} rows={4} className="input-base" required />
              </label>

              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <label className="block space-y-2 rounded-3xl border border-white/8 bg-slate-950/35 p-4">
                  <span className="text-sm font-medium text-slate-200">Example</span>
                  <textarea name="example" defaultValue={card.example ?? ""} rows={3} className="input-base" />
                </label>
                <label className="block space-y-2 rounded-3xl border border-white/8 bg-slate-950/35 p-4">
                  <span className="text-sm font-medium text-slate-200">Memory hook</span>
                  <textarea name="hook" defaultValue={card.hook ?? ""} rows={3} className="input-base" />
                </label>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <label className="block space-y-2 rounded-3xl border border-white/8 bg-slate-950/35 p-4">
                  <span className="text-sm font-medium text-slate-200">Synonyms</span>
                  <input name="synonyms" defaultValue={card.synonyms ?? ""} className="input-base" />
                </label>
                <label className="block space-y-2 rounded-3xl border border-white/8 bg-slate-950/35 p-4">
                  <span className="text-sm font-medium text-slate-200">Source context</span>
                  <textarea name="sourceContext" defaultValue={card.sourceContext ?? ""} rows={3} className="input-base" />
                </label>
              </div>

              <div className="mt-5 flex items-center justify-end gap-4">
                <SubmitButton label="Save edits" pendingLabel="Saving edits..." />
              </div>
            </form>
          ))}
        </div>
      </section>
    </AppShell>
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
  const tags = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function MetaPill({ label }: { label: string }) {
  return <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">{label}</span>;
}
