export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";
import { FounderBatchGenerator } from "@/components/founder-batch-generator";
import { createFounderBatchCards } from "@/app/cards/new/actions";
import { isDatabaseReady } from "@/lib/db-ready";

export default async function FounderWordsPage() {
  if (!(await isAdmin())) redirect("/");
  const ready = await isDatabaseReady();
  const decks = ready
    ? await prisma.deck.findMany({ where: { userId: null }, orderBy: { createdAt: "asc" } }).catch(() => [])
    : [];

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <p className="text-sm font-medium text-emerald-300">Daily founder words</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Generate fresh founder vocabulary you can actually use in speeches, networking, and product conversations.</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Use text or audio context, generate a small batch of useful terms, then save only the ones you want to learn.
          </p>
        </section>

        {decks.length > 0 ? (
          <FounderBatchGenerator decks={decks} saveAction={createFounderBatchCards} mode="daily" />
        ) : (
          <div className="rounded-3xl border border-amber-300/20 bg-amber-400/10 p-5 text-sm leading-7 text-amber-100">
            The database is not ready yet. Run [`prisma migrate deploy`](package.json:1) against your PostgreSQL database, then redeploy or refresh.
          </div>
        )}
      </div>
    </AppShell>
  );
}
