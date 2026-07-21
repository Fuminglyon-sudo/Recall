import { prisma } from "./prisma";

export type WeakWord = { front: string; back: string };

/**
 * The user's weakest reviewed vocabulary — the words their spaced-repetition
 * history says they're struggling to retain. Ordered by SM-2 ease factor
 * (lowest first: the cards graded poorly most often), restricted to cards
 * they've actually seen (repetitions > 0), so brand-new never-reviewed cards
 * don't count as "weak".
 *
 * Fed into the AI conversation practice prompts (Speak Up, Small Talk Lab) so
 * a session becomes rehearsal for the exact words the reviewer keeps missing —
 * the character steers toward openings for them, and the coaching notes whether
 * they were used. Returns [] for admin (null uid) and for anyone with no
 * reviewed cards yet, in which case the prompts fall back to their prior,
 * vocabulary-agnostic behaviour.
 */
export async function getWeakWords(uid: string | null, limit = 6): Promise<WeakWord[]> {
  if (!uid) return [];

  const cards = await prisma.card.findMany({
    where: { deck: { userId: uid }, repetitions: { gt: 0 } },
    orderBy: [{ easeFactor: "asc" }, { dueAt: "asc" }],
    take: limit,
    select: { front: true, back: true },
  });

  return cards.map((c) => ({ front: c.front, back: c.back }));
}

/**
 * Renders weak words as a compact `"word" (definition)` list for prompt
 * injection. Definitions are truncated so a handful of long cards can't blow
 * out the prompt.
 */
export function formatWeakWords(words: WeakWord[]): string {
  return words
    .map((w) => {
      const def = w.back.length > 120 ? `${w.back.slice(0, 117)}…` : w.back;
      return `"${w.front}" (${def})`;
    })
    .join(", ");
}
