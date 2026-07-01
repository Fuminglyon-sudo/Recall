import Link from "next/link";
import {
  BrainCircuit,
  Repeat2,
  Sparkles,
  BookOpen,
  CalendarCheck2,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";

export function LandingPage({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const features = [
    {
      icon: Repeat2,
      title: "Spaced repetition (SM-2)",
      body: "Each card is scheduled using the SM-2 algorithm. Cards you know well appear less often; ones you struggle with come back sooner. Over time, your reviews shrink and your retention grows.",
    },
    {
      icon: BrainCircuit,
      title: "Free recall",
      body: "Before each review, close the cards and write down everything you remember. Free recall is one of the most powerful memory techniques — Recall makes it a natural part of your session.",
    },
    {
      icon: Sparkles,
      title: "AI-drafted cards",
      body: "Type a word or concept and Claude drafts the definition, a memory hook, an example sentence, and simple synonyms. Edit freely — it is your card, not Claude's.",
    },
    {
      icon: BookOpen,
      title: "Personal decks",
      body: "Group cards into decks by topic, language, or project. All decks feed into a single daily review so vocabulary from different areas reinforces each other.",
    },
    {
      icon: CalendarCheck2,
      title: "Daily streaks & calendar",
      body: "A 28-day calendar shows exactly when you reviewed. Small, consistent sessions matter more than long occasional ones — Recall makes the pattern visible.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <header className="fixed inset-x-0 top-0 z-30 border-b border-white/8 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-emerald-400/15 p-2 text-emerald-300">
              <BrainCircuit className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold">Recall</span>
          </div>
          {isLoggedIn ? (
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-2xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pt-28 pb-24 space-y-24">
        {/* Hero */}
        <section className="space-y-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-1.5 text-xs font-medium text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            Powered by spaced repetition + Claude AI
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            A calm place to keep{" "}
            <span className="text-emerald-300">words, ideas,</span>
            <br className="hidden sm:block" /> and language close.
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Recall uses the SM-2 spaced repetition algorithm and Claude AI to help you build vocabulary, capture
            ideas, and remember what matters — one short session at a time.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {isLoggedIn ? (
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                <LayoutDashboard className="h-4 w-4" />
                Go to your dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                Get started with Google
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </section>

        {/* How it works */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">How it works</p>
            <h2 className="text-2xl font-semibold text-white">Simple by design</h2>
          </div>
          <ol className="grid gap-4 sm:grid-cols-3">
            {[
              { n: "01", title: "Add a card", body: "Capture a word, concept, or idea. Claude drafts the definition and memory hook — you edit and save." },
              { n: "02", title: "Review daily", body: "Recall surfaces cards that are due based on your past performance. Sessions are short by default." },
              { n: "03", title: "Watch it stick", body: "Cards you know well get longer intervals. Struggling cards come back sooner. Your memory compounds over time." },
            ].map(({ n, title, body }) => (
              <li key={n} className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-3">
                <span className="text-3xl font-bold text-emerald-300/30">{n}</span>
                <p className="text-base font-semibold text-white">{title}</p>
                <p className="text-sm leading-6 text-slate-400">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Features */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Features</p>
            <h2 className="text-2xl font-semibold text-white">Everything you need, nothing you don&apos;t</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-3">
                <div className="h-9 w-9 rounded-2xl bg-emerald-400/10 flex items-center justify-center text-emerald-300">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-sm leading-6 text-slate-400">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl border border-emerald-300/20 bg-emerald-400/5 p-10 text-center space-y-5">
          <h2 className="text-2xl font-semibold text-white">
            {isLoggedIn ? "Back to your practice" : "Start building your vocabulary today"}
          </h2>
          <p className="text-sm leading-6 text-slate-400">
            {isLoggedIn
              ? "Your cards and review schedule are waiting."
              : "Free to use. Sign in with Google to get started in under a minute."}
          </p>
          <Link
            href={isLoggedIn ? "/" : "/login"}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            {isLoggedIn ? (
              <>
                <LayoutDashboard className="h-4 w-4" />
                Go to dashboard
              </>
            ) : (
              "Sign in with Google"
            )}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>

      <footer className="border-t border-white/8 py-8 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} Recall. Built with spaced repetition and care.
      </footer>
    </div>
  );
}
