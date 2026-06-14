import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.reviewLog.deleteMany();
  await prisma.card.deleteMany();
  await prisma.deck.deleteMany();
  await prisma.streak.deleteMany();

  const vocabularyDeck = await prisma.deck.create({
    data: {
      name: "Vocabulary",
      description: "Plain-English words and phrases you want to keep active.",
    },
  });

  const peopleDeck = await prisma.deck.create({
    data: {
      name: "People I care about",
      description: "A gentle place for names, family details, and current life context.",
    },
  });

  const founderDeck = await prisma.deck.create({
    data: {
      name: "Founder Vocabulary",
      description: "Language for explaining what you built in Japa Reality and Sharpen with clarity and confidence.",
    },
  });

  const today = new Date();

  await prisma.card.createMany({
    data: [
      {
        deckId: vocabularyDeck.id,
        front: "lucid",
        back: "Clear and easy to understand, especially when explaining something complex.",
        partOfSpeech: "adjective",
        example: "Her explanation of the API flow was lucid enough for a non-technical founder to follow.",
        hook: "Lucid sounds like light — the idea becomes bright and visible.",
        synonyms: "clear, intelligible",
        kind: "VOCABULARY",
        interval: 0,
        repetitions: 0,
        easeFactor: 2.5,
        dueAt: today,
      },
      {
        deckId: vocabularyDeck.id,
        front: "succinct",
        back: "Brief but meaningful; saying only what is needed without losing substance.",
        partOfSpeech: "adjective",
        example: "A succinct founder update is easier for investors to trust and remember.",
        hook: "Think of a sentence trimmed down to its strongest bones.",
        synonyms: "concise, compact",
        kind: "VOCABULARY",
        dueAt: today,
      },
      {
        deckId: vocabularyDeck.id,
        front: "nuance",
        back: "A subtle detail or distinction that changes how something should be understood.",
        partOfSpeech: "noun",
        example: "The nuance in the policy advice matters because migration routes differ by life situation.",
        hook: "Nuance is the small hinge that swings the big meaning.",
        synonyms: "subtlety, distinction",
        kind: "VOCABULARY",
        dueAt: today,
      },
      {
        deckId: vocabularyDeck.id,
        front: "cohesive",
        back: "Fitting together well so the whole feels connected and consistent.",
        partOfSpeech: "adjective",
        example: "The deck felt cohesive because every card reinforced the same product story.",
        hook: "Co-hesive: the pieces stick together.",
        synonyms: "unified, integrated",
        kind: "VOCABULARY",
        dueAt: today,
      },
      {
        deckId: vocabularyDeck.id,
        front: "articulate",
        back: "To express an idea clearly and effectively in speech or writing.",
        partOfSpeech: "verb",
        example: "He could articulate the trade-offs without sounding defensive.",
        hook: "Articulate means your thoughts have joints and move cleanly.",
        synonyms: "express, explain",
        kind: "VOCABULARY",
        dueAt: today,
      },
      {
        deckId: vocabularyDeck.id,
        front: "pragmatic",
        back: "Focused on what works in real life rather than what is ideal in theory.",
        partOfSpeech: "adjective",
        example: "A pragmatic rollout starts with one user and one clear ritual.",
        hook: "Pragmatic choices survive contact with reality.",
        synonyms: "practical, realistic",
        kind: "VOCABULARY",
        dueAt: today,
      },
      {
        deckId: vocabularyDeck.id,
        front: "retention",
        back: "The ability to keep information, customers, or users over time.",
        partOfSpeech: "noun",
        example: "Spaced repetition is really a retention system for memory.",
        hook: "Retention means something stays instead of slipping away.",
        synonyms: "preservation, continuity",
        kind: "VOCABULARY",
        dueAt: today,
      },
      {
        deckId: vocabularyDeck.id,
        front: "signal",
        back: "A meaningful sign that helps you interpret what is happening.",
        partOfSpeech: "noun",
        example: "User drop-off after payment is a strong signal worth investigating.",
        hook: "A signal cuts through noise.",
        synonyms: "indicator, cue",
        kind: "VOCABULARY",
        dueAt: today,
      },
      {
        deckId: vocabularyDeck.id,
        front: "friction",
        back: "Anything in a flow that makes progress slower, harder, or less likely.",
        partOfSpeech: "noun",
        example: "Too many form steps create friction before users reach value.",
        hook: "Like physical friction, it resists movement.",
        synonyms: "resistance, obstacle",
        kind: "VOCABULARY",
        dueAt: today,
      },
      {
        deckId: vocabularyDeck.id,
        front: "iterate",
        back: "To improve something through repeated cycles of testing and refinement.",
        partOfSpeech: "verb",
        example: "We iterate on the prompt until the output feels trustworthy.",
        hook: "Each loop tightens the work.",
        synonyms: "refine, revise",
        kind: "VOCABULARY",
        dueAt: today,
      },
      {
        deckId: founderDeck.id,
        front: "Migration readiness score",
        back: "A summary signal in Japa Reality that helps a user understand how prepared they are across practical dimensions like budget, timing, and profile fit.",
        partOfSpeech: "product concept",
        example: "The migration readiness score turns a complicated intake into one signal the user can act on.",
        hook: "It is a dashboard shorthand for preparedness, not a promise.",
        synonyms: "readiness signal, preparedness metric",
        kind: "FOUNDER",
        sourceContext: "Japa Reality uses profile-fit scoring across multiple dimensions to turn a messy migration decision into something easier to understand and discuss.",
        dueAt: today,
      },
      {
        deckId: founderDeck.id,
        front: "Profile snapshot",
        back: "A saved user state in Japa Reality that preserves key migration details so the user can return without starting over.",
        partOfSpeech: "product concept",
        example: "The profile snapshot reduces form fatigue by letting users resume with their context intact.",
        hook: "Think of it as freezing the user’s current reality for later reuse.",
        synonyms: "saved state, profile memory",
        kind: "FOUNDER",
        sourceContext: "The Japa Reality backend includes profile snapshot and draft save endpoints to support continuity.",
        dueAt: today,
      },
      {
        deckId: founderDeck.id,
        front: "Job Reality analysis",
        back: "A Japa Reality feature that analyses current job-market demand, salary signals, and sponsorship hints so a migration plan is grounded in actual market conditions.",
        partOfSpeech: "product concept",
        example: "Job Reality analysis keeps the migration advice from becoming abstract or overly optimistic.",
        hook: "It connects dream to market proof.",
        synonyms: "market analysis, demand snapshot",
        kind: "FOUNDER",
        sourceContext: "The app calls Adzuna and enriches paid-plan flows with job-market feedback and clickable links.",
        dueAt: today,
      },
      {
        deckId: founderDeck.id,
        front: "Companion plan",
        back: "A subscription-style Japa Reality offer that extends beyond a one-off plan with updates, alerts, support, and ongoing execution help.",
        partOfSpeech: "offer design",
        example: "The Companion plan shifts the product from a single recommendation to an ongoing migration support relationship.",
        hook: "Companion implies walking beside the user, not just advising once.",
        synonyms: "ongoing support plan, continuity tier",
        kind: "FOUNDER",
        sourceContext: "The README and payment docs describe Companion as a monthly support layer with updates and dashboard access.",
        dueAt: today,
      },
      {
        deckId: founderDeck.id,
        front: "Daily Depth Drill",
        back: "A Sharpen practice mode that serves one AI-generated question each day so users can repeatedly train depth, structure, and recall under realistic pressure.",
        partOfSpeech: "practice mode",
        example: "The Daily Depth Drill turns irregular study into a repeatable habit with visible feedback.",
        hook: "One deliberate rep a day compounds.",
        synonyms: "daily practice prompt, repetition ritual",
        kind: "FOUNDER",
        sourceContext: "Sharpen positions the drill as a cold-topic prompt that generates scorecards and flashcards from real gaps.",
        dueAt: today,
      },
      {
        deckId: founderDeck.id,
        front: "Scorecard",
        back: "Sharpen’s structured feedback output that breaks an answer into dimensions like technical accuracy, clarity, depth, and conciseness.",
        partOfSpeech: "product artifact",
        example: "The scorecard makes weak spots concrete enough to improve, instead of leaving the user with a vague feeling.",
        hook: "A scorecard gives shape to performance.",
        synonyms: "feedback grid, evaluation breakdown",
        kind: "FOUNDER",
        sourceContext: "Sharpen repeatedly describes scorecards as the bridge between an answer and targeted flashcards or coaching.",
        dueAt: today,
      },
      {
        deckId: founderDeck.id,
        front: "Gap-driven flashcards",
        back: "Flashcards generated from what the user specifically missed or explained weakly, rather than from a generic pre-made deck.",
        partOfSpeech: "learning mechanism",
        example: "Gap-driven flashcards make review feel relevant because every card points back to a real failure mode.",
        hook: "The card is born from a miss, so it returns with purpose.",
        synonyms: "personalised review cards, weakness-based flashcards",
        kind: "FOUNDER",
        sourceContext: "Sharpen’s landing copy repeatedly contrasts its flashcards with generic recall apps by tying them to real user answers.",
        dueAt: today,
      },
      {
        deckId: founderDeck.id,
        front: "Teach-back selector",
        back: "A Sharpen mode where the user explains a concept as if teaching it, exposing whether understanding is merely familiar or truly internalised.",
        partOfSpeech: "practice mode",
        example: "Teach-back is useful because explanation under pressure reveals shallow understanding fast.",
        hook: "If you can teach it cleanly, you probably own it.",
        synonyms: "explanation drill, teaching mode",
        kind: "FOUNDER",
        sourceContext: "Sharpen includes teach-back as a dedicated practice route in the app structure.",
        dueAt: today,
      },
      {
        deckId: founderDeck.id,
        front: "Articulation under pressure",
        back: "The skill of expressing what you know clearly when challenged in an interview, review, or live decision-making moment.",
        partOfSpeech: "founder language",
        example: "Both Sharpen and Recall support articulation under pressure by making language easier to retrieve when it counts.",
        hook: "It is not just knowledge; it is knowledge that still works when the room goes quiet.",
        synonyms: "clear expression in the moment, performance clarity",
        kind: "FOUNDER",
        sourceContext: "Sharpen’s landing page emphasizes the gap between having depth and being able to express it when attention turns to you.",
        dueAt: today,
      },
      {
        deckId: founderDeck.id,
        front: "Founder articulation deck",
        back: "A Recall deck dedicated to helping you explain your own products, decisions, and mechanisms with more precise language and recall.",
        partOfSpeech: "meta concept",
        example: "The founder articulation deck gives product language its own review loop so explanation becomes easier over time.",
        hook: "You are not only remembering facts; you are rehearsing clarity.",
        synonyms: "founder vocabulary set, product explanation deck",
        kind: "FOUNDER",
        sourceContext: "This deck is intentionally seeded from Japa Reality and Sharpen so Recall supports how you speak about what you have built.",
        dueAt: today,
      },
    ],
  });

  await prisma.streak.create({ data: { currentStreak: 0, lastReviewDate: null } });

  console.log(`Seeded decks: ${vocabularyDeck.name}, ${peopleDeck.name}, ${founderDeck.name}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
