/**
 * Spreads all never-reviewed cards (repetitions = 0) across future days
 * at 6 per day, starting from today.
 *
 * Cards already in progress (repetitions > 0) are not touched.
 */
import { PrismaClient } from "@prisma/client";

const PER_DAY = 6;
const prisma = new PrismaClient();

async function main() {
  const newCards = await prisma.card.findMany({
    where: { repetitions: 0 },
    orderBy: [{ deckId: "asc" }, { createdAt: "asc" }],
    select: { id: true, front: true, deckId: true },
  });

  console.log(`Found ${newCards.length} never-reviewed cards to reschedule`);

  // Build day slots: 6 cards per slot, round-robin across decks
  // so each day's batch has variety from different decks.
  const byDeck = new Map<string, typeof newCards>();
  for (const card of newCards) {
    if (!byDeck.has(card.deckId)) byDeck.set(card.deckId, []);
    byDeck.get(card.deckId)!.push(card);
  }

  const orderedCards: typeof newCards = [];
  let progress = true;
  while (orderedCards.length < newCards.length && progress) {
    progress = false;
    for (const queue of byDeck.values()) {
      if (queue.length > 0) {
        orderedCards.push(queue.shift()!);
        progress = true;
      }
    }
  }

  // Assign due dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let updated = 0;
  for (let i = 0; i < orderedCards.length; i++) {
    const dayOffset = Math.floor(i / PER_DAY);
    const dueAt = new Date(today);
    dueAt.setDate(dueAt.getDate() + dayOffset);

    await prisma.card.update({
      where: { id: orderedCards[i].id },
      data: { dueAt },
    });
    updated++;
  }

  const days = Math.ceil(orderedCards.length / PER_DAY);
  console.log(`Rescheduled ${updated} cards across ${days} days (${PER_DAY}/day)`);
  console.log(`Today: ${Math.min(PER_DAY, orderedCards.length)} cards due`);
  console.log(`Last batch due: ${new Date(today.getTime() + (days - 1) * 86400000).toDateString()}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
