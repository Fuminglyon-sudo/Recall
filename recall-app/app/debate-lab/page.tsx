export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { DebateLabClient } from "@/components/debate-lab-client";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, scopedUserId } from "@/lib/session";
import { saveDebateCard } from "./actions";

export const metadata = { title: "Debate Lab — Soro Soke" };

export default async function DebateLabPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const decks = await prisma.deck.findMany({
    where: { userId: scopedUserId(userId) },
    select: { id: true, name: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <p className="text-sm font-medium text-amber-400">Debate Lab</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Defend your thinking when challenged.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Pick a motion or a real-life situation, choose your position, and go head-to-head with an AI opponent.
            Five structured exchanges — then get scored on your reasoning, logic, and ability to hold ground under pressure.
          </p>
        </section>

        <DebateLabClient decks={decks} saveCardAction={saveDebateCard} />
      </div>
    </AppShell>
  );
}
