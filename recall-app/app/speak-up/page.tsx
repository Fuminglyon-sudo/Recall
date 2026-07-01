export const dynamic = "force-dynamic";

import { AppShell } from "@/components/app-shell";
import { SpeakUpClient } from "@/components/speak-up-client";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, scopedUserId } from "@/lib/session";
import { saveCardFromSession } from "./actions";

export default async function SpeakUpPage() {
  const userId = await getCurrentUserId();

  const [decks, strugglingRaw] = userId
    ? await Promise.all([
        prisma.deck.findMany({
          where: { userId: scopedUserId(userId) },
          select: { id: true, name: true },
          orderBy: { createdAt: "asc" },
        }),
        prisma.card.findMany({
          where: { deck: { userId: scopedUserId(userId) }, easeFactor: { lt: 2.0 }, repetitions: { gt: 0 } },
          select: { front: true },
          take: 5,
          orderBy: { easeFactor: "asc" },
        }),
      ])
    : [[], []];

  const strugglingWords = strugglingRaw.map((c) => c.front);

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <p className="text-sm font-medium text-emerald-300">Speak Up</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Say what you mean — clearly, confidently, and in the moment.
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Pick a real-life situation — a job interview, a toast, defending a decision, explaining what you do.
            Choose who you&rsquo;re talking to and how much pressure you want. Say your answer, get honest feedback, and see a stronger version.
          </p>
        </section>

        <SpeakUpClient decks={decks} saveCardAction={saveCardFromSession} strugglingWords={strugglingWords} />
      </div>
    </AppShell>
  );
}
