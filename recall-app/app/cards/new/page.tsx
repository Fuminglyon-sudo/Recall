import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";
import { SubmitButton } from "@/components/forms";
import { createCard, createFounderBatchCards } from "./actions";
import { DraftCardForm } from "@/components/draft-card-form";
import { isDatabaseReady } from "@/lib/db-ready";
import { FounderBatchGenerator } from "@/components/founder-batch-generator";

export default async function NewCardPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const ready = await isDatabaseReady();
  const decks = ready ? await prisma.deck.findMany({ orderBy: { createdAt: "asc" } }).catch(() => []) : [];
  const params = await searchParams;
  const initialFront = params.front ?? "";
  const initialBack = params.back ?? "";

  return (
    <AppShell>
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_1.1fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <p className="text-sm font-medium text-emerald-300">Add a card</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Capture a word, idea, or person while it is still alive in your mind.</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Type the front of the card, ask Recall to draft the rest, edit anything you want, then save.
          </p>
          <div className="mt-8">
            {decks.length > 0 ? (
              <DraftCardForm
                decks={decks}
                createCardAction={createCard}
                initialFront={initialFront}
                initialBack={initialBack}
                submitButton={<SubmitButton label="Save card" pendingLabel="Saving card..." />}
              />
            ) : (
              <div className="rounded-3xl border border-amber-300/20 bg-amber-400/10 p-5 text-sm leading-7 text-amber-100">
                The database is not ready yet. Run [`prisma migrate deploy`](package.json:1) against your PostgreSQL database, then redeploy or refresh.
              </div>
            )}
          </div>
        </section>

        {decks.length > 0 ? <FounderBatchGenerator decks={decks} saveAction={createFounderBatchCards} /> : null}
      </div>
    </AppShell>
  );
}
