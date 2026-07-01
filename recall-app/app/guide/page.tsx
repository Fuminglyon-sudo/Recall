import Link from "next/link";
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
  { value: "3", label: "Okay", color: "text-yellow-300", dot: "bg-yellow-400", desc: "Recalled correctly but it felt laboured." },
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
    tagline: "Your home base.",
    what: "Shows everything at a glance — today's due count, current streak, mastered cards, word of the day, mastery distribution, a 30-day review heatmap, and the next 8 days of upcoming cards.",
    tips: [
      "Check the upcoming reviews calendar before adding new cards — if a big batch is due in 3 days, wait a day so the load stays even.",
      "Use the Voice panel to save the tone and phrasing style you want to speak in. It teaches the AI how to rephrase things in your voice.",
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
    tagline: "Learn the world one country at a time.",
    what: "Spaced repetition for world geography. Each card shows a country's flag, capital, continent, population, currency, languages, a local greeting phrase, national food, and a fun fact. Grade your recall and the same SM-2 algorithm schedules the next review.",
    tips: [
      "Focus on capitals and flags first — they are the anchors everything else hangs on.",
      "The local greeting phrase (Hi, Good morning, Good afternoon) is a great conversation opener. If you ever meet someone from that country, lead with it.",
      "Don't try to memorise every field at once. In early reviews just aim for flag + capital. The other details accumulate naturally over time.",
    ],
  },
  {
    href: "/speak-up",
    label: "Speak Up",
    icon: Mic,
    tagline: "Practice everyday communication out loud.",
    what: "You are given a real-world scenario (asking for a raise, pushing back on a deadline, navigating a difficult call) and an AI listener with a set personality and difficulty level. You go back and forth up to 4 times, then receive a score, strong points, one thing to improve, and a model response.",
    tips: [
      "Set difficulty to Hard intentionally. A listener who pushes back teaches you to hold your position under pressure — easy listeners only confirm what you already do well.",
      "Read your feedback before trying the same scenario again. The improvement note is specific — act on it in the next attempt rather than just hoping to do better.",
      "Use scenarios that reflect real situations you are currently facing, not abstract practice. The closer the scenario to something real, the more transferable the skill.",
    ],
  },
  {
    href: "/conversation-lab",
    label: "Conversation Lab",
    icon: MessageCircle,
    tagline: "Open-ended conversation practice.",
    what: "A freeform space to practice conversational fluency in different contexts. Less structured than Speak Up — designed for exploring language, testing ideas, and building comfort with open-ended dialogue.",
    tips: [
      "Use it to warm up before an important meeting or presentation — even a few minutes of verbal rehearsal significantly reduces in-the-moment friction.",
      "Try explaining your product or idea as if talking to someone who knows nothing about your industry. Gaps in clarity become obvious fast.",
    ],
  },
  {
    href: "/free-recall",
    label: "Free Recall",
    icon: BrainCircuit,
    tagline: "The hardest and most effective memory exercise.",
    what: "Pick a deck, then write every word or concept you can remember in 5 minutes — no hints, no cards. Your results are scored and, critically, fed back into your review schedule: remembered cards get a boost, missed cards are moved up so they return sooner.",
    tips: [
      "Do Free Recall before your Today review occasionally, not after. Attempting retrieval cold and then immediately seeing the cards in Today creates a powerful learning contrast.",
      "Don't look at the deck beforehand. The point is to surface what you have genuinely internalised, not what you can recall after priming.",
      "Pay close attention to the Missed list — those are your real weak spots, not the ones that feel hard during regular review.",
      "The All Decks option is more challenging and more revealing than single-deck recall. Use it for a full health check.",
    ],
  },
  {
    href: "/sentence-challenge",
    label: "Sentence Challenge",
    icon: PenLine,
    tagline: "Prove you can use the word, not just recognise it.",
    what: "The AI generates a realistic scenario and asks you to write a sentence using a specific word from your decks. It grades your sentence on accuracy, naturalness, and register — and gives you a better version if yours was off.",
    tips: [
      "Aim for sentences that reflect how you actually speak or write. Generic textbook sentences are graded lower and teach less.",
      "When the AI provides a better sentence, copy it into the card's example field. That way it becomes part of your review material.",
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
      "The AI draft is a starting point, not the final answer. Edit the example sentence to use a context relevant to your life or work. Personal examples are always more memorable than generic ones.",
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
    what: "Choose a scenario — plane conversation, demo day, cold investor intro. The AI plays an investor or evaluator and asks probing questions over 2–5 exchanges. At the end you receive a score out of 10, strong points, specific improvements, and a model answer showing how the response could have landed.",
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
    what: "Paste text from a pitch deck, product description, investor memo, or coaching session. The AI identifies 3–5 high-value vocabulary terms specific to your context and generates a complete card for each — definition, part of speech, example sentence, memory hook, and synonyms. Save the ones you want directly into any deck.",
    tips: [
      "Paste real content, not generic descriptions. The more specific the context, the more precise and useful the generated cards.",
      "After a pitch session, paste the feedback or transcript here immediately while the language is fresh. The terms that came up in the room are exactly the ones worth adding.",
      "Review the generated cards before saving and edit anything that doesn't sound like you. The AI gives you a strong draft, not a finished product.",
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
            Everything Recall can do, and how to use it well.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Recall is built around one idea: the things you want to say should come out naturally,
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
            practice features, the AI tools, the recall exercises — adds speed and depth. But
            consistent daily review is the foundation. Without it, nothing compounds.
          </p>
        </div>

      </div>
    </AppShell>
  );
}
