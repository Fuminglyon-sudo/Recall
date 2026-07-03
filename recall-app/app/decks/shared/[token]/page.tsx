export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";
import { SubmitButton } from "@/components/forms";
import { getCurrentUserId, scopedUserId } from "@/lib/session";
import { cloneSharedDeck } from "../../actions";

export default async function SharedDeckPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const deck = await prisma.deck.findFirst({
    where: { shareToken: token },
    include: { cards: { orderBy: { createdAt: "asc" } } },
  });

  if (!deck) notFound();

  const userId = await getCurrentUserId();
  const uid = userId ? scopedUserId(userId) : null;
  const isOwner = uid && deck.userId === uid;

  return (
    <AppShell>
      <section className="max-w-2xl space-y-6">
        {/* Deck header */}
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Shared deck</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">{deck.name}</h1>
          {deck.description ? (
            <p className="mt-2 text-sm leading-6 text-slate-400">{deck.description}</p>
          ) : null}
          <p className="mt-2 text-xs text-slate-600">
            {deck.cards.length} card{deck.cards.length !== 1 ? "s" : ""} · all with definitions, examples, hooks, and synonyms
          </p>

          <div className="mt-5 border-t border-white/8 pt-5">
            {isOwner ? (
              <Link
                href={`/decks/${deck.id}`}
                className="text-sm font-medium text-emerald-300 transition hover:text-emerald-200"
              >
                ← Back to your deck
              </Link>
            ) : uid ? (
              <form action={cloneSharedDeck}>
                <input type="hidden" name="token" value={token} />
                <SubmitButton label="Clone to my account" pendingLabel="Cloning…" />
              </form>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-slate-400">Sign in to add this deck to your account.</p>
                <Link
                  href="/login"
                  className="inline-flex items-center rounded-2xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                >
                  Sign in to clone this deck
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Card preview */}
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">
            Cards {deck.cards.length > 5 ? `(showing first 5 of ${deck.cards.length})` : ""}
          </p>
          <div className="space-y-3">
            {deck.cards.slice(0, 5).map((card) => (
              <div
                key={card.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-white">{card.front}</p>
                  {card.partOfSpeech ? (
                    <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-200">
                      {card.partOfSpeech}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-400">{card.back}</p>
                {card.example ? (
                  <p className="mt-2 text-xs leading-5 text-slate-500 italic">&ldquo;{card.example}&rdquo;</p>
                ) : null}
              </div>
            ))}
            {deck.cards.length > 5 ? (
              <p className="pt-1 text-center text-xs text-slate-600">
                +{deck.cards.length - 5} more cards included when you clone
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
