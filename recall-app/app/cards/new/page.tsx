import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";
import { SubmitButton } from "@/components/forms";
import { createCard } from "./actions";
import { DraftCardForm } from "@/components/draft-card-form";

export default async function NewCardPage() {
  const decks = await prisma.deck.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <AppShell>
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
        <p className="text-sm font-medium text-emerald-300">Add a card</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Capture a word, idea, or person while it is still alive in your mind.</h1>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          Type the front of the card, ask Recall to draft the rest, edit anything you want, then save.
        </p>
        <div className="mt-8">
          <DraftCardForm decks={decks} createCardAction={createCard} submitButton={<SubmitButton label="Save card" pendingLabel="Saving card..." />} />
        </div>
      </section>
    </AppShell>
  );
}
