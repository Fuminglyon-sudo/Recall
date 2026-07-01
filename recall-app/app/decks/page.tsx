export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";
import { createDeck } from "./actions";
import { SubmitButton } from "@/components/forms";
import { isDatabaseReady } from "@/lib/db-ready";
import { getCurrentUserId, scopedUserId } from "@/lib/session";

export default async function DecksPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");
  const uid = scopedUserId(userId);

  const ready = await isDatabaseReady();
  const decks = ready
    ? await prisma.deck.findMany({
        where: { userId: uid },
        orderBy: { createdAt: "asc" },
        include: { _count: { select: { cards: true } } },
      })
    : [];

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <p className="text-sm font-medium text-emerald-300">Decks</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Organise cards by the parts of your vocabulary that matter to you.</h1>
          <div className="mt-8 grid gap-4">
            {!ready ? (
              <div className="rounded-3xl border border-amber-300/20 bg-amber-400/10 p-5 text-sm leading-7 text-amber-100">
                Decks will appear after your PostgreSQL database has been migrated.
              </div>
            ) : null}
            {decks.map((deck) => (
              <Link key={deck.id} href={`/decks/${deck.id}`} className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 transition hover:border-emerald-300/30">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-white">{deck.name}</h2>
                    <p className="mt-2 text-sm leading-7 text-slate-400">{deck.description ?? "Words that belong together, gathered here."}</p>
                  </div>
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-300">{deck._count.cards} cards</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <p className="text-sm font-medium text-emerald-300">New deck</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">A new space for the words that belong here.</h2>
          <form action={createDeck} className="mt-6 space-y-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-200">Name</span>
              <input name="name" className="input-base" placeholder="e.g. Words I reach for" required />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-200">Description</span>
              <textarea name="description" rows={4} className="input-base" placeholder="What belongs in this deck?" />
            </label>
            <SubmitButton label="Create deck" pendingLabel="Creating deck..." />
          </form>
        </section>
      </div>
    </AppShell>
  );
}
