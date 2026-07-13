export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";
import { SubmitButton } from "@/components/forms";
import { createCard, createFounderBatchCards } from "./actions";
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
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-3">
                <p className="text-sm font-semibold text-white">Create a deck first</p>
                <p className="text-sm leading-6 text-slate-400">
                  Cards live inside decks. Go to your decks page to create one, or add a starter pack in seconds.
                </p>
                <a
                  href="/decks"
                  className="inline-flex items-center rounded-2xl bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                >
                  Go to decks →
                </a>
              </div>
            )}
          </div>
        </section>

        {decks.length > 0 ? <FounderBatchGenerator decks={decks} saveAction={createFounderBatchCards} /> : null}
      </div>
    </AppShell>
  );
}
