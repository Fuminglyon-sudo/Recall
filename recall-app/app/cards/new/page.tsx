export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";
import { SubmitButton } from "@/components/forms";
import { createCard, createFounderBatchCards } from "./actions";
import { createDeck } from "../../decks/actions";
import { DraftCardForm } from "@/components/draft-card-form";
import { isDatabaseReady } from "@/lib/db-ready";
import { FounderBatchGenerator } from "@/components/founder-batch-generator";
import { getCurrentUserId, scopedUserId } from "@/lib/session";

export default async function NewCardPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");
  const uid = scopedUserId(userId);

  const ready = await isDatabaseReady();
  const decks = ready ? await prisma.deck.findMany({ where: { userId: uid }, orderBy: { createdAt: "asc" } }).catch(() => []) : [];
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
            Type the front of the card, ask Soro Soke to draft the rest, edit anything you want, then save.
          </p>
          <div className="mt-8">
            {!ready ? (
              <div className="rounded-3xl border border-amber-300/20 bg-amber-400/10 p-5 text-sm leading-7 text-amber-100">
                The database is not ready yet. Run <code>prisma migrate deploy</code> against your PostgreSQL database, then redeploy or refresh.
              </div>
            ) : decks.length > 0 ? (
              <DraftCardForm
                decks={decks}
                createCardAction={createCard}
                initialFront={initialFront}
                initialBack={initialBack}
                submitButton={<SubmitButton label="Save card" pendingLabel="Saving card..." />}
              />
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-5">
                <div>
                  <p className="text-sm font-semibold text-white">Create a deck to get started</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Cards live inside decks. Name one below and you will land right back here, ready to add your first card.
                  </p>
                </div>
                <form action={createDeck} className="space-y-4">
                  <input type="hidden" name="redirectTo" value="/cards/new" />
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-200">Name</span>
                    <input name="name" className="input-base" placeholder="e.g. Words I reach for" required />
                  </label>
                  <SubmitButton label="Create deck" pendingLabel="Creating deck..." />
                </form>
                <div className="border-t border-white/8 pt-4">
                  <p className="text-sm leading-6 text-slate-400">
                    Or start with a hand-curated starter pack instead.
                  </p>
                  <Link
                    href="/decks"
                    className="mt-2 inline-flex items-center text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
                  >
                    Browse starter packs →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {decks.length > 0 ? <FounderBatchGenerator decks={decks} saveAction={createFounderBatchCards} /> : null}
      </div>
    </AppShell>
  );
}
