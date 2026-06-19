export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";
import { JargonBrowser } from "@/components/jargon-browser";
import { isDatabaseReady } from "@/lib/db-ready";

export default async function CorporateJargonPage() {
  const ready = await isDatabaseReady();

  const deck = ready
    ? await prisma.deck.findFirst({
        where: { name: "Corporate Jargon" },
        include: {
          cards: {
            select: {
              id: true,
              front: true,
              back: true,
              partOfSpeech: true,
              example: true,
              hook: true,
              synonyms: true,
            },
            orderBy: { front: "asc" },
          },
        },
      })
    : null;

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <p className="text-sm font-medium text-emerald-300">Corporate Jargon</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            The language of meetings, boardrooms, and business conversations.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            50 terms you will hear constantly in professional settings — from quick pings and hard stops to synergies and moving the needle. Click any term to see the definition, an example, and a memory hook.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            All terms also appear in your Today queue so spaced repetition keeps them fresh.
          </p>
        </section>

        {deck ? (
          <JargonBrowser cards={deck.cards} />
        ) : (
          <div className="rounded-[2rem] border border-amber-300/20 bg-amber-400/10 p-10 text-center">
            <p className="text-sm text-amber-200">Database not ready. Run prisma migrate deploy and refresh.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
