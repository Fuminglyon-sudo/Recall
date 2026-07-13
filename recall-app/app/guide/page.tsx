import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guide — How to Use Soro Soke",
  description:
    "A complete guide to using Soro Soke: setting up flashcard decks with spaced repetition, practicing high-stakes speaking with Speak Up, and building social fluency with Conversation Lab.",
  keywords: [
    "Soro Soke guide",
    "how to use spaced repetition",
    "flashcard guide",
    "Speak Up guide",
    "Conversation Lab guide",
    "SM-2 tutorial",
  ],
};
import {
  LayoutDashboard,
  CalendarCheck2,
  Globe,
  Mic,
  MessageCircle,
  Mic2,
  Users,
  BookmarkCheck,
  BrainCircuit,
  PenLine,
  Sparkles,
  Briefcase,
  Layers3,
  Search,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { isAdmin } from "@/lib/session";

// ── Data ────────────────────────────────────────────────────────────────────

const GRADES = [
  { value: "0", label: "Blackout", color: "text-red-400", dot: "bg-red-500", desc: "Complete blank — nothing came to mind at all." },
  { value: "1", label: "Wrong", color: "text-red-300", dot: "bg-red-400", desc: "Had an answer but it was incorrect." },
  { value: "2", label: "Hard", color: "text-orange-300", dot: "bg-orange-400", desc: "Got it right but only after serious effort." },
  { value: "3", label: "Okay", color: "text-yellow-300", dot: "bg-yellow-400", desc: "Retrieved correctly but it felt laboured." },
  { value: "4", label: "Good", color: "text-emerald-300", dot: "bg-emerald-400", desc: "Correct with only a brief hesitation." },
  { value: "5", label: "Perfect", color: "text-teal-300", dot: "bg-teal-400", desc: "Instant, effortless recall — no doubt at all." },
];

const MASTERY = [
  { label: "New", color: "text-slate-400", dot: "bg-slate-500", border: "border-slate-400/20", bg: "bg-slate-400/5", desc: "Not reviewed yet. Will appear in your first Today session.", interval: "Interval: 0 days" },
  { label: "Learning", color: "text-orange-300", dot: "bg-orange-400", border: "border-orange-400/20", bg: "bg-orange-400/5", desc: "Reviewed but still unstable. Returns frequently until it sticks.", interval: "Interval: 1–6 days" },
  { label: "Familiar", color: "text-sky-300", dot: "bg-sky-400", border: "border-sky-400/20", bg: "bg-sky-400/5", desc: "Consistent recall. Building real momentum.", interval: "Interval: 7–20 days" },
  { label: "Mastered", color: "text-emerald-300", dot: "bg-emerald-400", border: "border-emerald-400/20", bg: "bg-emerald-400/5", desc: "Solid. Surfaces only occasionally to keep it sharp.", interval: "Interval: 21+ days" },
];

type Feature = {
  href: string;
  label: string;
  icon: React.ElementType;
  tagline: string;
  what: string;
  tips: string[];
  adminOnly?: boolean;
};

const FEATURES: Feature[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    tagline: "Where your practice lives.",
    what: "Shows everything at a glance — today's due count, current streak, mastered cards, word of the day, mastery distribution, a 30-day review heatmap, and the next 8 days of upcoming cards.",
    tips: [
      "Check the upcoming reviews calendar before adding new cards — if a big batch is due in 3 days, wait a day so the load stays even.",
      "Use the Voice panel to save the tone and phrasing style you want to speak in. It teaches Soro Soke how to rephrase things in your voice.",
      "The word of the day rotates through every card you have reviewed at least once — a low-effort daily reminder of something you already know.",
    ],
  },
  {
    href: "/today",
    label: "Today",
    icon: CalendarCheck2,
    tagline: "Where the learning actually happens.",
    what: "Your daily review queue. Shows reviewed cards that are due plus up to 3 new cards (one per deck, round-robin). Cards from previous days you missed are tagged Overdue and appear first so backlogs clear before fresh cards are added.",
    tips: [
      "Grade yourself honestly. Giving a 4 when it was really a 2 just delays the moment you truly own the word — the algorithm only works when your ratings are accurate.",
      "Use the association field on new cards. The first time a card appears, there is a box to write a personal memory hook. Write anything that links the word to something you already know — a sound, a story, an image. It dramatically improves retention.",
      "If you only have 5 minutes, do Today first — it is the highest-leverage action in the app.",
      "Grades 0–2 reset the card so it returns tomorrow. Grades 3–5 advance it. When in doubt, grade down rather than up.",
    ],
  },
  {
    href: "/countries",
    label: "Countries",
    icon: Globe,
    tagline: "Know something real about where people are from — and watch the conversation open.",
    what: "Spaced repetition for world geography and culture. Each country card shows its flag, capital, continent, currency, languages, a local greeting phrase, national food, and a fun fact. The same SM-2 algorithm that builds your vocabulary builds your world knowledge — so when you meet someone from anywhere, you have something genuine to say.",
    tips: [
      "Knowing even one word in someone's language — their hello, their thank you — changes the temperature of a conversation instantly. That greeting is worth more than ten business cards.",
      "Focus on flags and capitals first. They are the anchors everything else hangs on — and the fastest way to signal that you pay attention to the world.",
      "The national food and fun fact fields are conversation starters, not trivia. When you meet someone from that country, ask about them — people light up when a stranger knows something specific about where they are from.",
    ],
  },
  {
    href: "/speak-up",
    label: "Speak Up",
    icon: Mic,
    tagline: "The room where you rehearse before the room that counts.",
    what: "Most people lose opportunities not because they lack ability, but because the right words didn't come when the moment did. Speak Up puts you in high-stakes scenarios — asking for a raise, pushing back on a decision, navigating a difficult call — with Soro Soke as a listener who responds at the difficulty level you choose. Each scenario opens with a coaching tip specific to that context before the first exchange. You go back and forth up to 4 times, then receive a score, your strong points, one specific thing to improve, the exact exchange where the conversation shifted, and a model response.",
    tips: [
      "Set difficulty to Hard intentionally. A listener who pushes back trains you to hold your position under pressure. Easy listeners only confirm what you already do well — that is not practice, it is performance.",
      "Read your feedback before trying the same scenario again. The improvement note is specific — act on it in the very next attempt rather than hoping to do better by instinct.",
      "Use scenarios that mirror situations you are currently facing, not abstract practice. The closer the scenario to something real, the more directly the skill transfers.",
      "Audacity is not volume. It is knowing what you want to say and trusting yourself to say it. Speak Up builds that trust one rehearsed conversation at a time.",
    ],
  },
  {
    href: "/conversation-lab",
    label: "Conversation Lab",
    icon: MessageCircle,
    tagline: "Become someone conversations come easily to.",
    what: "Ten real-world social scenarios — a networking mixer, a flight next to a stranger, a wedding reception where you know nobody, a dinner party, and more. Each opens with a coaching tip specific to that context, so you go in with a concrete strategy rather than hoping for the best. You start the conversation, keep it going, then receive a score, strong points, one specific improvement, and the exact exchange where things shifted — so you know precisely what to work on next time.",
    tips: [
      "Use it to warm up before a meeting, a pitch, or any situation where you want to be sharp. Even five minutes of open dialogue reduces friction when the real moment arrives.",
      "Try explaining something you know well to someone who knows nothing about it. If your words are unclear in the lab, they will be unclear in the room.",
      "The goal is not to say the right thing — it is to stop fearing the wrong thing. The more time you spend in conversation, the less each individual conversation feels like a test.",
    ],
  },
  {
    href: "/free-recall",
    label: "Free Soro Soke",
    icon: BrainCircuit,
    tagline: "The exercise that shows you what you actually know.",
    what: "Pick a deck, then write every word or concept you can remember in 5 minutes — no hints, no cards. Your results are scored and, critically, fed back into your review schedule: remembered cards get a boost, missed cards are moved up so they return sooner.",
    tips: [
      "Do Free Soro Soke before your Today review occasionally, not after. Attempting retrieval cold and then immediately seeing the cards in Today creates a powerful learning contrast.",
      "Don't look at the deck beforehand. The point is to surface what you have genuinely internalised, not what you can recall after priming.",
      "Pay close attention to the Missed list — those are your real weak spots, not the ones that feel hard during regular review.",
      "The All Decks option is more challenging and more revealing than single-deck recall. Use it for a full health check.",
    ],
  },
  {
    href: "/sentence-challenge",
    label: "Sentence Challenge",
    icon: PenLine,
    tagline: "Using a word is different from knowing it. This is where you find out.",
    what: "Soro Soke generates a realistic scenario and asks you to write a sentence using a specific word from your decks. It grades your sentence on accuracy, naturalness, and register — and gives you a better version if yours was off.",
    tips: [
      "Aim for sentences that reflect how you actually speak or write. Generic textbook sentences are graded lower and teach less.",
      "When Soro Soke provides a better sentence, copy it into the card's example field. That way it becomes part of your review material.",
      "Do Sentence Challenge with words in the Learning mastery level — they are the ones on the edge of becoming familiar, and production practice is what pushes them over.",
    ],
  },
  {
    href: "/corporate-jargon",
    label: "Corporate Jargon",
    icon: Briefcase,
    tagline: "A searchable library of professional language.",
    what: "50+ terms you will hear in boardrooms, investor meetings, and business conversations — from circle back and hard stop to boiling the ocean and moving the needle. Each entry has a definition, real example, and memory hook.",
    tips: [
      "When you hear an unfamiliar term in a meeting, come here first before asking — it is faster and the example sentences give you context to use it yourself.",
      "Save the terms you encounter most often as cards in your Vocabulary deck so they go through spaced repetition.",
      "Read the memory hooks even for terms you already know. The hook often reframes the term in a way that makes it easier to use naturally.",
    ],
  },
  {
    href: "/decks",
    label: "Decks",
    icon: Layers3,
    tagline: "Organise your cards into themed collections.",
    what: "Create, browse, and manage all your flashcard decks. Each deck shows how many cards are due, the full mastery breakdown, and lets you open, edit, export, or import cards.",
    tips: [
      "Keep decks focused. A deck named Vocabulary that mixes words from every context makes it harder to build thematic associations. Separate by topic, project, or context.",
      "Export your deck as CSV occasionally as a backup. Import is the fastest way to bulk-add cards from a spreadsheet you already have.",
      "Click into a deck to edit individual cards — you can update the back, example, hook, or synonyms at any time as your understanding deepens.",
    ],
  },
  {
    href: "/search",
    label: "Search Cards",
    icon: Search,
    tagline: "Find any card instantly across all your decks.",
    what: "Real-time search across every card's front, back, example, and synonyms. Results show which deck the card lives in and its current mastery level.",
    tips: [
      "Use it to check whether a word is already in your collection before adding a duplicate.",
      "Search for synonyms or related concepts to find clusters of cards you can study together.",
    ],
  },
  {
    href: "/cards/new",
    label: "Add Card",
    icon: PlusCircle,
    tagline: "Capture a word or idea before it slips away.",
    what: "Type the front (the word or concept) and optionally ask Claude to draft the definition, part of speech, example sentence, memory hook, and synonyms. Everything is editable before you save.",
    tips: [
      "Add cards in the moment — waiting until later means you will forget the context that made the word feel important.",
      "Soro Soke's draft is a starting point, not the final answer. Edit the example sentence to use a context relevant to your life or work. Personal examples are always more memorable than generic ones.",
      "The hook field is the most underused field. A good hook is a story, image, or sound association that makes the word unforgettable. Take 20 seconds to write something weird or personal.",
      "Choose the deck deliberately. A card in the wrong deck gets reviewed out of context and never fully sticks.",
    ],
  },
];

const ADMIN_FEATURES: Feature[] = [
  {
    href: "/pitch-practice",
    label: "Pitch Practice",
    icon: Mic2,
    tagline: "Sharpen your pitch under realistic pressure.",
    what: "Choose a scenario — plane conversation, demo day, cold investor intro. Soro Soke plays an investor or evaluator and asks probing questions over 2–5 exchanges. At the end you receive a score out of 10, strong points, specific improvements, and a model answer showing how the response could have landed.",
    tips: [
      "Run the same scenario multiple times. The first attempt surfaces gaps; the second and third build the muscle memory to close them.",
      "Treat the model answer as a template, not a script. Rework it in your own language so it sounds like you, then practice it until it is natural.",
      "Use the Hard mode scenarios (cold intro, elevator pitch) more than the comfortable ones. Pressure in practice means calm in the room.",
      "After a session, copy the improvement note into a card so it enters your spaced repetition. Feedback you only read once is feedback you forget.",
    ],
    adminOnly: true,
  },
  {
    href: "/social-skills",
    label: "Social Skills Lab",
    icon: Users,
    tagline: "Practice conversations before the room does it for you.",
    what: "10 real-world social scenarios — airplane, networking mixer, wedding, coffee queue, elevator, conference hallway, and more. Choose a character type (Introvert, Extrovert, Hard to Read, Talkative, Distracted…) and difficulty level. You open the conversation, keep it going, then receive coaching on what landed and one power move to try next time.",
    tips: [
      "Always choose Hard to Read or Distracted at medium difficulty before important social events. These characters mirror the toughest real-world interactions.",
      "Start the conversation differently each session. The way you open sets the tone for everything that follows — experimenting here costs nothing.",
      "The Power Move at the end of each session is the one high-leverage behaviour identified in your specific exchange. Practise it consciously in the next session.",
      "Save sessions you want to revisit. Reviewing past sessions shows you your actual pattern of improvement over time, not just how you feel in the moment.",
    ],
    adminOnly: true,
  },
  {
    href: "/saved-sessions",
    label: "Saved Sessions",
    icon: BookmarkCheck,
    tagline: "Your archive of past social and pitch sessions.",
    what: "Every Social Skills and Pitch Practice session you choose to save appears here, with the full conversation transcript, your score, strong points, improvements, and the model conversation. Use it to track progress over time and revisit sessions that were particularly instructive.",
    tips: [
      "Review saved sessions before entering a similar real-world situation. Reading what you did well and what to improve is more useful than rereading theory.",
      "Look for patterns across sessions — if the same improvement note keeps appearing, that is the one behaviour worth targeting deliberately.",
    ],
    adminOnly: true,
  },
  {
    href: "/founder-words",
    label: "Founder Words",
    icon: Sparkles,
    tagline: "Generate vocabulary directly from your product context.",
    what: "Paste text from a pitch deck, product description, investor memo, or coaching session. Soro Soke identifies 3–5 high-value vocabulary terms specific to your context and generates a complete card for each — definition, part of speech, example sentence, memory hook, and synonyms. Save the ones you want directly into any deck.",
    tips: [
      "Paste real content, not generic descriptions. The more specific the context, the more precise and useful the generated cards.",
      "After a pitch session, paste the feedback or transcript here immediately while the language is fresh. The terms that came up in the room are exactly the ones worth adding.",
      "Review the generated cards before saving and edit anything that doesn't sound like you. Soro Soke gives you a strong draft, not a finished product.",
      "Build a dedicated Founder Vocabulary deck and run it through spaced repetition consistently. The goal is to reach the point where this language comes out naturally, without searching for the word.",
    ],
    adminOnly: true,
  },
];

// ── Components ───────────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{children}</p>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-start gap-4">
        <div className="shrink-0 rounded-2xl bg-emerald-400/10 p-3 text-emerald-300">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold text-white">{feature.label}</h2>
            <Link
              href={feature.href}
              className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-slate-400 transition hover:text-slate-200"
            >
              Open <ArrowRight className="h-2.5 w-2.5" />
            </Link>
          </div>
          <p className="mt-0.5 text-sm font-medium text-emerald-300/80">{feature.tagline}</p>
          <p className="mt-3 text-sm leading-7 text-slate-400">{feature.what}</p>
          <div className="mt-4 space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
              How to get the most out of it
            </p>
            <ul className="space-y-2">
              {feature.tips.map((tip, i) => (
                <li key={i} className="flex gap-3 text-sm leading-6 text-slate-300">
                  <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400/60" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function GuidePage() {
  const admin = await isAdmin();

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-12">

        {/* Hero */}
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <p className="text-sm font-medium text-emerald-300">Guide</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            A quiet guide to each part of the app — and how to use it well.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Soro Soke is built around one idea: the things you want to say should come out naturally,
            without searching. Spaced repetition handles the memory side. The practice features handle
            the fluency side. Use them together consistently and both compound.
          </p>
        </section>

        {/* How spaced repetition works */}
        <section className="space-y-4">
          <SectionHeading>How spaced repetition works</SectionHeading>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm leading-7 text-slate-300">
              Every card has an <span className="font-medium text-white">interval</span> — the number
              of days before it comes back for review. When you grade yourself well, the interval
              grows. When you struggle, it resets to 1 day. Over time, cards you know deeply come
              back once a month or less. Cards you find difficult come back every day until they stick.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              The algorithm (SM-2) adjusts both the interval and an{" "}
              <span className="font-medium text-white">ease factor</span> for each card. Easier cards
              grow their intervals faster. Harder cards grow more slowly. You never need to think about
              this — just grade honestly and it works.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Each day, <span className="font-medium text-white">Today</span> shows you reviewed cards
              that are due plus up to 3 new cards. If you miss a day, overdue cards appear first so
              your backlog clears before new material is added. A daily session of 10–15 minutes is
              enough. The value comes from consistency, not volume.
            </p>
          </div>
        </section>

        {/* Grading scale */}
        <section className="space-y-4">
          <SectionHeading>Grading scale — 0 to 5</SectionHeading>
          <p className="text-xs leading-6 text-slate-500">
            Grade how easily you recalled the answer, not whether the answer was technically correct.
            The algorithm only calibrates properly when your grades reflect your actual experience.
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {GRADES.map(({ value, label, color, dot, desc }) => (
              <div key={value} className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${dot}`} />
                  <p className={`text-xs font-semibold ${color}`}>
                    {value} — {label}
                  </p>
                </div>
                <p className="mt-1.5 text-xs leading-5 text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs leading-6 text-slate-500">
            When in doubt, grade down. An honest 2 today means the card comes back tomorrow and you
            actually learn it. A generous 4 means it disappears for a week and you forget it again.
          </p>
        </section>

        {/* Mastery levels */}
        <section className="space-y-4">
          <SectionHeading>Mastery levels</SectionHeading>
          <div className="grid gap-3 sm:grid-cols-2">
            {MASTERY.map(({ label, color, dot, border, bg, desc, interval }) => (
              <div key={label} className={`rounded-2xl border p-4 ${border} ${bg}`}>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${dot}`} />
                  <p className={`text-xs font-semibold ${color}`}>{label}</p>
                </div>
                <p className="mt-1.5 text-xs leading-5 text-slate-300">{desc}</p>
                <p className="mt-1 text-[10px] text-slate-500">{interval}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features — all users */}
        <section className="space-y-4">
          <SectionHeading>Features</SectionHeading>
          <div className="space-y-4">
            {FEATURES.map((f) => (
              <FeatureCard key={f.href} feature={f} />
            ))}
          </div>
        </section>

        {/* Admin-only features */}
        {admin ? (
          <section className="space-y-4">
            <SectionHeading>Admin features</SectionHeading>
            <div className="space-y-4">
              {ADMIN_FEATURES.map((f) => (
                <FeatureCard key={f.href} feature={f} />
              ))}
            </div>
          </section>
        ) : null}

        {/* Closing note */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-6 py-5">
          <p className="text-sm leading-7 text-slate-400">
            The single most important habit is opening Today every day. Everything else — the
            practice features, Soro Soke&apos;s tools, the recall exercises — adds speed and depth. But
            consistent daily review is the foundation. Without it, nothing compounds.
          </p>
        </div>

      </div>
    </AppShell>
  );
}
