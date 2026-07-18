import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const today = new Date();

  const founderDeck = await prisma.deck.findFirst({ where: { name: "Founder Vocabulary" } });
  if (!founderDeck) throw new Error("Founder Vocabulary deck not found");

  const existing = await prisma.card.findMany({
    where: { deckId: founderDeck.id },
    select: { front: true },
  });
  const existingFronts = new Set(existing.map((c) => c.front.toLowerCase()));

  const words = [
    {
      front: "flywheel",
      back: "A self-reinforcing growth loop where each part of the system feeds the next, building momentum that compounds over time.",
      partOfSpeech: "noun",
      example: "Soro Soke's flywheel: users review cards → retention improves → they tell other founders → more cards get added → the product deepens.",
      hook: "A flywheel is hard to start but hard to stop — once it spins, it pulls itself forward.",
      synonyms: "growth loop, compounding cycle, virtuous cycle",
    },
    {
      front: "sequence, not fork",
      back: "The principle that startups should do one important thing at a time rather than splitting resources across parallel tracks — momentum builds when efforts are serial, not simultaneous.",
      partOfSpeech: "principle",
      example: "We need to sequence, not fork — nail the migration plan before building the community feature, not both at once.",
      hook: "A fork splits your energy. A sequence stacks it. You get further doing one thing fully than two things halfway.",
      synonyms: "do one thing at a time, serial focus, avoid splitting",
    },
    {
      front: "D2C",
      back: "Direct-to-Consumer — selling your product directly to end users without a middleman, retailer, or third-party distributor.",
      partOfSpeech: "noun",
      example: "Japa Reality is a D2C product — the person who pays is also the person the product serves.",
      hook: "D2C means you own the relationship with the person using the product.",
      synonyms: "direct-to-consumer, direct sales, owner-to-user",
    },
    {
      front: "virality",
      back: "The tendency of a product to spread organically because existing users naturally bring in new users as a byproduct of using it.",
      partOfSpeech: "noun",
      example: "If a Japa Reality user shares their migration plan with a friend who is also relocating, that is organic virality.",
      hook: "Virality is when the product markets itself through use.",
      synonyms: "organic growth, word-of-mouth loop, viral coefficient",
    },
    {
      front: "compounding",
      back: "Growth that accelerates over time because each cycle builds on the results of the last — the foundational logic behind spaced repetition and long-term business building.",
      partOfSpeech: "noun",
      example: "Three reviews of a card compound into long-term recall. Three months of consistent product iteration compound into a better product.",
      hook: "Compounding is slow at first and invisible — then suddenly very large.",
      synonyms: "exponential growth, accumulation, snowball effect",
    },
    {
      front: "land and expand",
      back: "A growth strategy where you win a small, specific use case or customer first, then expand scope, features, or spend once trust is established.",
      partOfSpeech: "strategy",
      example: "Japa Reality lands with a single migration plan, then expands into ongoing Companion support once the user sees the value.",
      hook: "Land first, earn the right to expand later.",
      synonyms: "start small and grow, beachhead then expand, crawl-walk-run",
    },
    {
      front: "zero to one",
      back: "Creating something genuinely new that did not exist before, rather than copying or incrementally improving something that already exists. From Peter Thiel's framework.",
      partOfSpeech: "concept",
      example: "A structured AI-powered migration plan is closer to zero to one than another visa checklist tool.",
      hook: "Zero to one is invention. One to n is iteration. Both matter — but they require different thinking.",
      synonyms: "true innovation, category creation, novel product",
    },
    {
      front: "first principles",
      back: "Thinking from fundamental truths rather than from analogy or convention — breaking a problem down to its basic components and rebuilding from there.",
      partOfSpeech: "noun",
      example: "First principles thinking on migration: what does someone actually need to relocate successfully, not what existing apps already offer.",
      hook: "First principles strips away assumption and starts from what is actually true.",
      synonyms: "foundational reasoning, first-principles thinking, reasoning from basics",
    },
    {
      front: "category creation",
      back: "Defining and naming a new type of product so clearly that competitors are measured against your definition, not the other way around.",
      partOfSpeech: "strategy",
      example: "If Japa Reality defines 'migration intelligence' as a category, it becomes the benchmark others are compared to.",
      hook: "Category creators do not compete for the top of the leaderboard — they build the leaderboard.",
      synonyms: "market creation, defining the space, new category",
    },
    {
      front: "default alive",
      back: "A startup is default alive if, on current revenue growth and cost trajectory, it will reach profitability before running out of cash. If not, it is default dead.",
      partOfSpeech: "concept",
      example: "Before raising, the most important question is: are we default alive? If yes, we can negotiate from strength.",
      hook: "Default alive means the runway ends in profitability, not in zero.",
      synonyms: "path to profitability, financially sustainable, default dead (opposite)",
    },
    {
      front: "signal vs noise",
      back: "Distinguishing the meaningful, actionable information (signal) from the irrelevant, misleading, or random data (noise) — critical for making good product and business decisions.",
      partOfSpeech: "concept",
      example: "A spike in sign-ups after a tweet is noise. Consistent week-three retention is signal.",
      hook: "Noise is loud. Signal is quiet but it is the only thing worth acting on.",
      synonyms: "meaningful data, relevant feedback, separating insight from distraction",
    },
    {
      front: "ideal customer profile",
      back: "A precise description of the specific type of customer who gets the most value from your product, is most likely to pay, and is most likely to stay.",
      partOfSpeech: "noun",
      example: "Japa Reality's ICP is a Nigerian professional with a stable job offer abroad and 3–12 months until intended relocation.",
      hook: "The ICP is not your average customer — it is your best-fit customer.",
      synonyms: "ICP, target customer, best-fit user",
    },
    {
      front: "proof of concept",
      back: "An early demonstration that a core idea is technically and practically feasible, before committing to full product development.",
      partOfSpeech: "noun",
      example: "The first version of the migration plan builder was a proof of concept — enough to show the idea worked, not a finished product.",
      hook: "A proof of concept answers one question: can this actually work?",
      synonyms: "POC, prototype, feasibility test",
    },
    {
      front: "activation",
      back: "The moment a new user first experiences the core value of your product — the point where they understand why it exists and why it matters to them.",
      partOfSpeech: "noun",
      example: "For Soro Soke, activation is the moment a user reviews their first card and realises the spaced repetition is already working.",
      hook: "Activation is the handshake where the product makes its promise real.",
      synonyms: "aha moment, value realisation, first meaningful action",
    },
    {
      front: "retention",
      back: "The proportion of users who continue using the product over time — the clearest single signal of whether a product is genuinely delivering value.",
      partOfSpeech: "noun",
      example: "Retention at week four is more meaningful than sign-up numbers — it shows the product is sticky, not just findable.",
      hook: "Retention is the truth that acquisition can hide.",
      synonyms: "stickiness, user staying, ongoing engagement",
    },
  ];

  let added = 0;
  for (const word of words) {
    if (existingFronts.has(word.front.toLowerCase())) {
      console.log(`  skip: ${word.front} (already exists)`);
      continue;
    }
    await prisma.card.create({
      data: {
        deckId: founderDeck.id,
        front: word.front,
        back: word.back,
        partOfSpeech: word.partOfSpeech,
        example: word.example,
        hook: word.hook,
        synonyms: word.synonyms,
        kind: "FOUNDER",
        dueAt: today,
      },
    });
    console.log(`  added: ${word.front}`);
    added++;
  }

  console.log(`\nFounder Vocabulary: ${added} new cards added`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
