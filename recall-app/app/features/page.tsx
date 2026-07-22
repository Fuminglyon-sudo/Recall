import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, XCircle, BookOpen, CalendarCheck2, FileText, Bell } from "lucide-react";
import { MarketingNav } from "@/components/marketing-nav";
import { MarketingFooter } from "@/components/marketing-footer";

export const metadata: Metadata = {
  title: { absolute: "Features — Sọrọ Sọkẹ AI" },
  description:
    "Sọrọ Sọkẹ AI features: Speak Up speaking practice, Small Talk Lab social coaching, Debate Lab reasoning practice, and SM-2 spaced repetition with AI-drafted flashcards so the vocabulary actually sticks.",
  keywords: [
    "Speak Up practice",
    "Small Talk Lab",
    "Debate Lab",
    "debate practice app",
    "argument coaching",
    "social anxiety app",
    "confidence building app",
    "spaced repetition features",
    "AI flashcard app",
    "SM-2 algorithm",
    "free recall",
    "vocabulary app features",
    "Soro Soke features",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "/features" },
  openGraph: {
    title: "Features — Sọrọ Sọkẹ AI",
    description: "How Sọrọ Sọkẹ AI's speaking, debate, and conversation practice work — plus the spaced-repetition engine underneath that makes sure the words stick.",
    type: "website",
    url: "/features",
  },
  twitter: {
    card: "summary_large_image",
    title: "Features — Sọrọ Sọkẹ AI",
    description: "Speak Up, Small Talk Lab, Debate Lab, and SM-2 spaced repetition with AI-drafted flashcards.",
  },
};

const COMPARISON_ROWS: [string, boolean, boolean, boolean, boolean][] = [
  ["Speak Up speaking practice", true,  false, false, false],
  ["Small Talk Lab coaching",  true,  false, false, false],
  ["Debate Lab reasoning practice", true, false, false, false],
  ["Doc Lab meeting practice",   true,  false, false, false],
  ["SM-2 spaced repetition",     true,  true,  false, false],
  ["Soro Soke-drafted cards",        true,  false, false, false],
  ["Free recall sessions",       true,  false, false, false],
  ["Clean, focused UI",          true,  false, true,  false],
  ["CSV export & import",        true,  true,  false, false],
  ["Push reminders",             true,  false, true,  false],
  ["Build your own vocabulary",  true,  true,  false, true ],
  ["Free trial included",        true,  true,  true,  true ],
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased flex flex-col">
      <MarketingNav />

      <main className="mx-auto max-w-5xl flex-1 px-6">

        {/* ── Hero ── */}
        <section className="py-20 space-y-4 border-b border-white/8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Features</p>
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl" style={{ textWrap: "balance" } as React.CSSProperties}>
            Built so the words show up when it counts
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-400">
            Every feature exists to get you from knowing a word to using it under pressure — in a pitch, a hard
            conversation, a debate you didn&apos;t see coming. Nothing is here because it feels productive.
            Everything is here because it works.
          </p>
        </section>

        {/* ── Screenshots gallery ── */}
        <section className="py-10 border-b border-white/8">
          <div className="grid gap-4 sm:grid-cols-3">
            {([
              { src: "/dashboard.png", alt: "Soro Soke dashboard showing review streak, 30-day activity heatmap, and deck list with mastery progress", label: "Dashboard" },
              { src: "/speak_up_cards.png", alt: "Speak Up scenario picker with high-stakes practice categories", label: "Speak Up" },
              { src: "/conversation_lab.png", alt: "Small Talk Lab social scenario picker", label: "Small Talk Lab" },
            ] as const).map(({ src, alt, label }) => (
              <div key={label} className="overflow-hidden rounded-2xl border border-white/10 shadow-lg shadow-black/30">
                <Image src={src} alt={alt} width={600} height={420} className="w-full h-auto" />
                <p className="border-t border-white/8 bg-slate-900/60 px-4 py-2.5 text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Practice modes ── */}
        <section className="py-20 border-b border-white/8">
          <div className="space-y-10">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Practice modes</p>
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>Apply what you know under pressure</h2>
              <p className="text-slate-400">Four interactive modes that put your language and thinking to the test in real situations.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                {
                  label: "Speak Up",
                  href: "/speak-up",
                  accent: "text-violet-300",
                  accentBg: "bg-violet-400/10",
                  bullets: [
                    "High-stakes scenario library",
                    "Voice or typed responses",
                    "Score, filler-word count, model answer",
                    "Ideal full-conversation replay",
                  ],
                  desc: "Rehearse before a specific high-pressure moment: a pitch, an interview, a negotiation. You perform; the AI coaches.",
                },
                {
                  label: "Small Talk Lab",
                  href: "/conversation-lab",
                  accent: "text-sky-300",
                  accentBg: "bg-sky-400/10",
                  bullets: [
                    "Open social scenarios",
                    "Real-time next-move coaching",
                    "No script or guided prompts",
                    "Social fluency scoring",
                  ],
                  desc: "Drop into a natural setting — a networking event, a long flight, a dinner party — with no script and get coached on every move.",
                },
                {
                  label: "Debate Lab",
                  href: "/debate-lab",
                  accent: "text-amber-300",
                  accentBg: "bg-amber-400/10",
                  bullets: [
                    "Formal motions or real-life situations",
                    "4 opponent archetypes with scouting reports",
                    "Prep room before you begin",
                    "Skill sub-scores across 5 dimensions",
                  ],
                  desc: "Go five structured exchanges against an AI that argues back. Win on logic, evidence, and composure — not just volume.",
                },
                {
                  label: "Doc Lab",
                  href: "/doc-lab",
                  accent: "text-emerald-300",
                  accentBg: "bg-emerald-400/10",
                  bullets: [
                    "Practice documents across 6 topics",
                    "Or paste a real doc before a real meeting",
                    "Scored on judgement, not nitpicking",
                    "Your documents are never stored",
                  ],
                  desc: "Read a document and arrive with the questions nobody else asked — then learn to phrase them so they land without sounding like an attack.",
                },
              ].map(({ label, href, accent, accentBg, bullets, desc }) => (
                <div key={label} className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className={`inline-flex items-center rounded-xl px-3 py-1 text-xs font-semibold ${accentBg} ${accent}`}>
                    {label}
                  </div>
                  <p className="text-sm leading-6 text-slate-400">{desc}</p>
                  <ul className="space-y-2">
                    {bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />{b}
                      </li>
                    ))}
                  </ul>
                  <a href={href} className={`inline-flex items-center gap-1 text-xs font-medium ${accent} hover:underline`}>
                    Try it →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Feature deep-dives ── */}
        <section className="py-20 border-b border-white/8 space-y-20">

          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">The engine underneath</p>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>None of that works if the words aren&apos;t there yet</h2>
            <p className="text-slate-400">Before you can use a word under pressure, it has to actually be in your head. This is how it gets there.</p>
          </div>

          {/* Spaced repetition */}
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Spaced repetition</p>
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>
                The SM-2 algorithm, quietly running in the background
              </h2>
              <p className="text-base leading-7 text-slate-400">
                SM-2 calculates the optimal interval between reviews based on how accurately you remembered each card.
                Cards drift from daily to weekly to monthly as they strengthen — shrinking your workload automatically over time.
              </p>
              <ul className="space-y-3">
                {["Automatic interval scheduling", "Per-card ease factor adjustment", "New, learning, familiar, and mastered levels", "Separate queue for new vs. due cards"].map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />{b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden lg:block overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40">
              <Image
                src="/today_card.png"
                alt="Soro Soke review card showing a vocabulary word revealed with definition, memory hook, and 6 grading buttons"
                width={900}
                height={620}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Smart drafting */}
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div className="hidden lg:block overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40">
              <Image
                src="/cards_new.png"
                alt="Soro Soke add card page showing AI-generated definition, memory hook, and example sentence for a word"
                width={900}
                height={620}
                className="w-full h-auto"
              />
            </div>
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Smart drafting</p>
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>
                Stop staring at a blank card
              </h2>
              <p className="text-base leading-7 text-slate-400">
                Type a word or phrase. Soro Soke drafts the definition, a memory hook, an example sentence, and synonyms in seconds.
                You edit anything you like — the card is yours. Creating a high-quality card takes thirty seconds instead of five minutes.
              </p>
              <ul className="space-y-3">
                {["One-click draft generation", "Definition, hook, example, and synonyms", "Edit freely before saving", "Works for any language or subject"].map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />{b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Free recall */}
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Free recall</p>
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>
                The most underused memory technique
              </h2>
              <p className="text-base leading-7 text-slate-400">
                Before seeing your cards, write down everything you remember from a deck without any cues.
                Free recall — retrieval practice without hints — is one of the highest-ROI techniques in cognitive science.
                Soro Soke makes it a first-class part of your review, not an afterthought.
              </p>
              <ul className="space-y-3">
                {["Write-first, compare-second workflow", "No peeking enforced before you recall", "SM-2 grades update on submission", "Confirmation feedback after each session"].map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />{b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden lg:block overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40">
              <Image
                src="/deck_learning.png"
                alt="Soro Soke decks page showing mastery progress bars across New, Learning, Familiar, and Mastered levels"
                width={900}
                height={620}
                className="w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* ── Everything else ── */}
        <section className="py-20 border-b border-white/8">
          <div className="space-y-10">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Everything else, without the noise</h2>
              <p className="text-slate-400">The features that make a practice sustainable.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: BookOpen,       title: "Personal decks",      body: "Organise cards by topic, language, or project. All decks feed into a single daily review queue." },
                { icon: CalendarCheck2, title: "Streak calendar",      body: "28-day review calendar. Small, consistent sessions matter more than long occasional ones." },
                { icon: FileText,       title: "CSV export & import",  body: "Export any deck to CSV. Import cards in bulk. Your data is always portable." },
                { icon: Bell,           title: "Push reminders",       body: "Opt-in daily reminders so you never miss a review. Works on mobile and desktop." },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-white">{title}</p>
                  <p className="text-sm leading-6 text-slate-400">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comparison ── */}
        <section className="py-20 border-b border-white/8">
          <div className="space-y-10">
            <div className="max-w-2xl space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Comparison</p>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl" style={{ textWrap: "balance" } as React.CSSProperties}>
                Built for people who want language that comes when they need it
              </h2>
              <p className="text-slate-400">
                Most tools ask you to manage the practice. Soro Soke manages it for you — so you can just show up.
                Most of what&apos;s below, other tools already do. The top three rows are the reason Sọrọ Sọkẹ exists.
              </p>
            </div>
            <div className="overflow-x-auto rounded-3xl border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Feature</th>
                    {["Soro Soke", "Anki", "Duolingo", "Paper cards"].map((col, i) => (
                      <th key={col} className={`px-6 py-4 text-center text-xs font-semibold uppercase tracking-widest ${i === 0 ? "text-emerald-300" : "text-slate-500"}`}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/8">
                  {COMPARISON_ROWS.map(([feature, ...vals]) => (
                    <tr key={feature} className="transition hover:bg-white/[0.02]">
                      <td className="px-6 py-3.5 font-medium text-slate-200">{feature}</td>
                      {vals.map((v, i) => (
                        <td key={i} className="px-6 py-3.5 text-center">
                          {v
                            ? <CheckCircle2 className={`mx-auto h-4 w-4 ${i === 0 ? "text-emerald-400" : "text-slate-500"}`} />
                            : <XCircle className="mx-auto h-4 w-4 text-slate-800" />
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20">
          <div className="rounded-3xl border border-emerald-400/15 bg-gradient-to-br from-emerald-950/50 via-slate-900/60 to-slate-950 p-12 text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/8 px-4 py-1.5 text-xs font-medium text-emerald-300">
              First 50 spots free forever · Then $9.99/mo
            </div>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>
              The words you reach for — finally within reach
            </h2>
            <p className="text-slate-400">Claim one of the remaining founder spots and get every feature free — forever. After 50, it&apos;s $9.99/mo.</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-7 py-3.5 text-base font-bold text-slate-950 transition hover:bg-emerald-300"
              >
                Claim your free spot
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/8"
              >
                See pricing
              </Link>
            </div>
            <p className="text-xs text-slate-600">No credit card required · Spots are first-come, first-served</p>
          </div>
        </section>

      </main>

      <MarketingFooter />
    </div>
  );
}
