import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const today = new Date();

  // ── Founder Vocabulary ────────────────────────────────────────────────────
  const founderDeck = await prisma.deck.findFirst({ where: { name: "Founder Vocabulary" } });
  if (!founderDeck) throw new Error("Founder Vocabulary deck not found");

  const existingFounder = await prisma.card.findMany({
    where: { deckId: founderDeck.id },
    select: { front: true },
  });
  const founderFronts = new Set(existingFounder.map((c) => c.front.toLowerCase()));

  const founderWords = [
    {
      front: "wedge",
      back: "A narrow initial use case or customer segment you focus on exclusively to break into a market, with the intention of expanding later.",
      partOfSpeech: "noun",
      example: "Japa Reality started with Nigerian professionals relocating to the UK as its wedge before expanding to other corridors.",
      hook: "A wedge is thin at the tip — it enters a small gap and then opens the whole door.",
      synonyms: "beachhead, entry point, initial market",
    },
    {
      front: "churn",
      back: "The rate at which customers stop using or paying for your product, expressed as a percentage over a given period.",
      partOfSpeech: "noun",
      example: "If churn is high in month two, the product is not delivering enough value to justify staying.",
      hook: "Churn is what happens when the bucket has a hole — you pour more in but still lose water.",
      synonyms: "attrition, customer loss, cancellation rate",
    },
    {
      front: "API",
      back: "Application Programming Interface — a defined way for two software systems to communicate and share data or functionality.",
      partOfSpeech: "noun",
      example: "Japa Reality uses the Adzuna API to pull live job listings into the migration plan.",
      hook: "An API is a contract between systems — each side knows exactly what to ask for and what to expect back.",
      synonyms: "interface, integration layer, endpoint",
    },
    {
      front: "runway",
      back: "The amount of time a startup can continue operating at its current burn rate before running out of cash.",
      partOfSpeech: "noun",
      example: "With six months of runway, the priority is reaching a paying customer before raising more capital.",
      hook: "Runway is the strip ahead of the plane — you need to be airborne before it ends.",
      synonyms: "cash timeline, operating horizon",
    },
    {
      front: "burn rate",
      back: "The amount of money a startup spends each month, typically before it is profitable.",
      partOfSpeech: "noun",
      example: "Keeping the burn rate low means the team can test more hypotheses without raising external capital.",
      hook: "Money burns. The rate tells you how fast.",
      synonyms: "monthly spend, cash consumption",
    },
    {
      front: "product-market fit",
      back: "The point at which a product satisfies a strong enough market demand that customers retain, refer, and pay for it consistently.",
      partOfSpeech: "noun",
      example: "You know you have product-market fit when users are disappointed if the product disappears.",
      hook: "PMF feels like pull — the market is dragging the product forward instead of you pushing it.",
      synonyms: "PMF, market fit, demand validation",
    },
    {
      front: "TAM",
      back: "Total Addressable Market — the total revenue opportunity available if a product captured every possible customer in its target space.",
      partOfSpeech: "noun",
      example: "The TAM for African professionals navigating relocation is large, but the serviceable slice for Japa Reality is more specific.",
      hook: "TAM is the whole ocean. You are fishing in one part of it.",
      synonyms: "total market size, addressable market",
    },
    {
      front: "moat",
      back: "A durable competitive advantage that makes it difficult for others to replicate or displace your product.",
      partOfSpeech: "noun",
      example: "A strong user community and country-specific migration data are two early moats for Japa Reality.",
      hook: "A moat is the water around the castle — it does not stop everyone, but it slows them down significantly.",
      synonyms: "competitive advantage, defensibility, barrier to entry",
    },
    {
      front: "unit economics",
      back: "The revenue and cost associated with a single customer or transaction — the per-unit profit picture that shows whether the business model works at scale.",
      partOfSpeech: "noun",
      example: "Before scaling, understand the unit economics: what does it cost to acquire one customer versus what they pay over their lifetime.",
      hook: "Zoom in to one customer. If the math works there, it can work everywhere.",
      synonyms: "per-unit margin, customer-level economics",
    },
    {
      front: "LTV",
      back: "Lifetime Value — the total revenue a business can expect from a single customer over the entire relationship.",
      partOfSpeech: "noun",
      example: "If LTV is three times CAC, the business model is generally considered sustainable.",
      hook: "LTV is the full harvest from one planted seed.",
      synonyms: "customer lifetime value, CLV",
    },
    {
      front: "CAC",
      back: "Customer Acquisition Cost — the total cost of sales and marketing required to acquire one new customer.",
      partOfSpeech: "noun",
      example: "Word-of-mouth referrals reduce CAC significantly compared to paid advertising.",
      hook: "CAC is the price of the handshake that starts the customer relationship.",
      synonyms: "cost per acquisition, acquisition cost",
    },
    {
      front: "ARR",
      back: "Annual Recurring Revenue — the yearly value of all subscription or recurring contracts, used to measure predictable revenue growth.",
      partOfSpeech: "noun",
      example: "Reaching $10K ARR as a solo founder is an early signal that the product has real paying demand.",
      hook: "ARR is the drumbeat — predictable, repeating income you can plan around.",
      synonyms: "recurring annual revenue, subscription revenue",
    },
    {
      front: "go-to-market",
      back: "The plan and strategy for how a product reaches customers — covering pricing, channels, messaging, and who does the selling.",
      partOfSpeech: "noun",
      example: "The go-to-market for the Companion plan focuses on warm referrals from users who completed a basic migration plan.",
      hook: "GTM is the bridge between building the product and customers actually using it.",
      synonyms: "GTM, launch strategy, distribution plan",
    },
    {
      front: "north star metric",
      back: "The single most important metric that best captures the core value a product delivers to its users — the one number the whole team aligns around.",
      partOfSpeech: "noun",
      example: "For a spaced repetition app, the north star metric might be cards reviewed per active user per week.",
      hook: "Everything else is context; the north star is the one you navigate by.",
      synonyms: "primary KPI, growth metric, core measure",
    },
    {
      front: "bootstrap",
      back: "To build and grow a company without external funding, using revenue or personal savings instead of investor capital.",
      partOfSpeech: "verb",
      example: "Both Japa Reality and Sharpen were bootstrapped, which means every decision is disciplined by real cash flow.",
      hook: "Pulling yourself up by your own bootstraps — no outside lift.",
      synonyms: "self-fund, grow organically, operate without investment",
    },
    {
      front: "defensibility",
      back: "How resistant a business is to being copied or undercut by competitors — the structural features that protect its market position.",
      partOfSpeech: "noun",
      example: "Data network effects and curated country-specific resources improve the defensibility of Japa Reality over time.",
      hook: "Defensibility is what remains when a well-funded competitor tries to copy you.",
      synonyms: "competitive protection, moat strength, barrier",
    },
    {
      front: "pivot",
      back: "A structured change in business strategy — adjusting the product, target market, revenue model, or channel while keeping core insights intact.",
      partOfSpeech: "noun/verb",
      example: "If paid plan conversions stay low, the next step might be a pivot toward B2B migration consultancy.",
      hook: "A pivot keeps one foot planted while the other foot swings.",
      synonyms: "strategic shift, course correction, repositioning",
    },
    {
      front: "freemium",
      back: "A pricing model where a basic version of the product is free and users pay for additional features, capacity, or depth.",
      partOfSpeech: "noun",
      example: "Recall uses a freemium-adjacent model — core review is free and the AI-powered features add value on top.",
      hook: "Freemium trades access for conversion — the free tier is also marketing.",
      synonyms: "free tier, try before you buy, gated features",
    },
    {
      front: "traction",
      back: "Evidence that a product is gaining real market momentum — measured through user growth, revenue, retention, or engagement signals.",
      partOfSpeech: "noun",
      example: "Early traction does not have to be large numbers; it has to be the right users returning consistently.",
      hook: "Traction is the wheels gripping the road — you can feel the product starting to move.",
      synonyms: "momentum, market validation, early adoption signal",
    },
  ];

  let founderAdded = 0;
  for (const word of founderWords) {
    if (founderFronts.has(word.front.toLowerCase())) continue;
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
    founderAdded++;
  }
  console.log(`Founder Vocabulary: added ${founderAdded} new cards`);

  // ── Corporate Jargon ──────────────────────────────────────────────────────
  const jargonDeck = await prisma.deck.findFirst({ where: { name: "Corporate Jargon" } });
  if (!jargonDeck) {
    console.log("Corporate Jargon deck not found — skipping");
  } else {
    const existingJargon = await prisma.card.findMany({
      where: { deckId: jargonDeck.id },
      select: { front: true },
    });
    const jargonFronts = new Set(existingJargon.map((c) => c.front.toLowerCase()));

    const jargonWords = [
      {
        front: "bandwidth",
        back: "Capacity or availability to take on additional work, usually referring to a person or team.",
        partOfSpeech: "noun",
        example: "I do not have the bandwidth to take on a new project this sprint.",
        hook: "Borrowed from networking — a person's bandwidth is how much they can process at once.",
        synonyms: "capacity, headroom, availability",
      },
      {
        front: "circle back",
        back: "To return to a topic, decision, or person at a later time, typically after gathering more information.",
        partOfSpeech: "verb phrase",
        example: "Let us circle back on the pricing decision once we have the customer data.",
        hook: "You are not dropping it — you are putting a pin in it and looping around.",
        synonyms: "follow up, revisit, return to",
      },
      {
        front: "take offline",
        back: "To move a conversation out of the current group setting and handle it privately between two or more people.",
        partOfSpeech: "verb phrase",
        example: "That is a good point but let us take it offline so we can keep the meeting on track.",
        hook: "Offline means out of the public channel — a side conversation after the main one.",
        synonyms: "follow up privately, handle separately, discuss outside the meeting",
      },
      {
        front: "boil the ocean",
        back: "To attempt an unnecessarily large or complex task when a more focused approach would be more effective.",
        partOfSpeech: "verb phrase",
        example: "We do not need to boil the ocean — start with the one market segment we know best.",
        hook: "Literally impossible to do, and so is the task it describes.",
        synonyms: "overcomplicate, do too much, over-engineer",
      },
      {
        front: "low-hanging fruit",
        back: "Easy wins or opportunities that can be acted on quickly with minimal effort or risk.",
        partOfSpeech: "noun phrase",
        example: "The first low-hanging fruit is converting existing free users with strong engagement to paid.",
        hook: "The fruit at the bottom of the tree. Reach up and it is yours.",
        synonyms: "easy wins, quick wins, immediate opportunities",
      },
      {
        front: "deliverable",
        back: "A tangible output or piece of work that can be handed over or reviewed at the end of a task or project.",
        partOfSpeech: "noun",
        example: "The main deliverable for this sprint is a working prototype with the core flow tested.",
        hook: "A deliverable is what you actually hand across the table.",
        synonyms: "output, artefact, result",
      },
      {
        front: "stakeholder",
        back: "Anyone with a significant interest in the outcome of a project — they may influence it or be affected by it.",
        partOfSpeech: "noun",
        example: "The key stakeholders for the product launch are the founding team, early users, and the payment partner.",
        hook: "They have a stake in the game — something to gain or lose from the outcome.",
        synonyms: "interested party, decision-maker, investor",
      },
      {
        front: "leverage",
        back: "To use something — a relationship, data, tool, or position — to achieve a disproportionate result.",
        partOfSpeech: "verb",
        example: "We can leverage the existing user community to gather migration stories for the next product update.",
        hook: "Leverage is mechanical advantage — small force, large effect.",
        synonyms: "use strategically, capitalise on, maximise",
      },
      {
        front: "KPI",
        back: "Key Performance Indicator — a quantifiable measure used to evaluate how well an objective is being met.",
        partOfSpeech: "noun",
        example: "The main KPI for the first month is weekly active users who complete at least one review session.",
        hook: "KPIs are the dials on the dashboard — they tell you if you are heading in the right direction.",
        synonyms: "metric, measure, performance indicator",
      },
      {
        front: "OKR",
        back: "Objectives and Key Results — a goal-setting framework that pairs a high-level objective with two to five measurable results that define success.",
        partOfSpeech: "noun",
        example: "The OKR for this quarter is to reach 500 active users, measured by weekly session data.",
        hook: "OKRs pair the destination (objective) with proof you arrived (key results).",
        synonyms: "goal framework, quarterly targets, objective-setting",
      },
      {
        front: "scalable",
        back: "Able to handle increasing demand or growth efficiently, without proportional increases in cost or complexity.",
        partOfSpeech: "adjective",
        example: "The Companion plan is scalable because the AI does the heavy lifting as users grow.",
        hook: "Scalable means bigger does not break it — it just runs more of the same machine.",
        synonyms: "growth-ready, efficient at scale, repeatable",
      },
      {
        front: "30,000-foot view",
        back: "A high-level, strategic perspective on a situation, without getting into operational detail.",
        partOfSpeech: "noun phrase",
        example: "From a 30,000-foot view, both products are solving the same core problem: access.",
        hook: "At 30,000 feet you see the whole map, not the street signs.",
        synonyms: "helicopter view, big picture, strategic overview",
      },
      {
        front: "drill down",
        back: "To examine a topic, data set, or problem in increasing detail to find the root cause or full picture.",
        partOfSpeech: "verb phrase",
        example: "Let us drill down into the drop-off data to understand where users are leaving the flow.",
        hook: "You start at the surface and drill until you hit something solid.",
        synonyms: "go deeper, investigate in detail, examine closely",
      },
      {
        front: "alignment",
        back: "A shared understanding and agreement on goals, priorities, or direction among a group of people.",
        partOfSpeech: "noun",
        example: "Before the sprint starts, we need alignment on which features are actually in scope.",
        hook: "Alignment means everyone is pointing the same direction — no diverging vectors.",
        synonyms: "shared agreement, consensus, clarity of direction",
      },
      {
        front: "value proposition",
        back: "The clear statement of what a product offers, who it is for, and why it is better than the alternatives.",
        partOfSpeech: "noun",
        example: "The value proposition for Japa Reality is structured, personalised migration guidance that replaces scattered research.",
        hook: "What is in it for them? The value proposition answers that directly.",
        synonyms: "core offer, product promise, customer value",
      },
    ];

    let jargonAdded = 0;
    for (const word of jargonWords) {
      if (jargonFronts.has(word.front.toLowerCase())) continue;
      await prisma.card.create({
        data: {
          deckId: jargonDeck.id,
          front: word.front,
          back: word.back,
          partOfSpeech: word.partOfSpeech,
          example: word.example,
          hook: word.hook,
          synonyms: word.synonyms,
          kind: "VOCABULARY",
          dueAt: today,
        },
      });
      jargonAdded++;
    }
    console.log(`Corporate Jargon: added ${jargonAdded} new cards`);
  }

  // ── Vocabulary ────────────────────────────────────────────────────────────
  const vocabDeck = await prisma.deck.findFirst({ where: { name: "Vocabulary" } });
  if (!vocabDeck) {
    console.log("Vocabulary deck not found — skipping");
  } else {
    const existingVocab = await prisma.card.findMany({
      where: { deckId: vocabDeck.id },
      select: { front: true },
    });
    const vocabFronts = new Set(existingVocab.map((c) => c.front.toLowerCase()));

    const vocabWords = [
      {
        front: "astute",
        back: "Having a sharp ability to understand situations and make good judgements, often quickly.",
        partOfSpeech: "adjective",
        example: "An astute observer noticed the product's real value was in the data layer, not the interface.",
        hook: "Astute is sharp intelligence applied to the real world — not just clever, but perceptive.",
        synonyms: "perceptive, shrewd, insightful",
      },
      {
        front: "substantiate",
        back: "To provide evidence or proof that makes a claim believable and concrete.",
        partOfSpeech: "verb",
        example: "You need specific numbers to substantiate that claim in front of investors.",
        hook: "Substantiate gives your statement a substance it can stand on.",
        synonyms: "prove, support, back up",
      },
      {
        front: "leverage",
        back: "An advantage, resource, or position you can use to achieve a stronger or faster outcome.",
        partOfSpeech: "noun",
        example: "Domain expertise is the founder's leverage in conversations where others have more capital.",
        hook: "Leverage is mechanical advantage — same effort, greater effect.",
        synonyms: "advantage, influence, strategic position",
      },
      {
        front: "candid",
        back: "Truthful and direct, even about uncomfortable things, without being unkind.",
        partOfSpeech: "adjective",
        example: "A candid conversation about the product gaps was more useful than polite agreement.",
        hook: "Candid light in photography reveals the subject as they actually are — same idea here.",
        synonyms: "frank, direct, honest",
      },
      {
        front: "distil",
        back: "To extract the essential meaning or key points from something complex or lengthy.",
        partOfSpeech: "verb",
        example: "Can you distil the problem into one sentence I can repeat to someone who wasn't in the room?",
        hook: "Distilling removes everything that isn't the core — like purifying liquid.",
        synonyms: "summarise, extract, reduce to essentials",
      },
      {
        front: "deliberate",
        back: "Done with full intention and careful thought, not by accident or impulse.",
        partOfSpeech: "adjective",
        example: "A deliberate product decision is one you could explain with a clear reason if asked.",
        hook: "Deliberate means the hand moved because the mind chose it.",
        synonyms: "intentional, considered, purposeful",
      },
      {
        front: "ambiguity",
        back: "Uncertainty or lack of clarity where more than one interpretation is possible.",
        partOfSpeech: "noun",
        example: "Founders often have to make decisions in ambiguity — there is rarely a clean answer.",
        hook: "Ambiguity is the fog. Good judgement is moving confidently through it anyway.",
        synonyms: "uncertainty, vagueness, lack of clarity",
      },
      {
        front: "compelling",
        back: "Strongly persuasive or interesting, difficult to ignore or dismiss.",
        partOfSpeech: "adjective",
        example: "A compelling pitch does not just explain — it makes the listener feel the problem.",
        hook: "Compelling compels you — it creates a kind of internal gravity.",
        synonyms: "persuasive, powerful, convincing",
      },
    ];

    let vocabAdded = 0;
    for (const word of vocabWords) {
      if (vocabFronts.has(word.front.toLowerCase())) continue;
      await prisma.card.create({
        data: {
          deckId: vocabDeck.id,
          front: word.front,
          back: word.back,
          partOfSpeech: word.partOfSpeech,
          example: word.example,
          hook: word.hook,
          synonyms: word.synonyms,
          kind: "VOCABULARY",
          dueAt: today,
        },
      });
      vocabAdded++;
    }
    console.log(`Vocabulary: added ${vocabAdded} new cards`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
