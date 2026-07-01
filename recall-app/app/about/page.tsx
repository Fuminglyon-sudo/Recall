import type { Metadata } from "next";
import Link from "next/link";
import { BrainCircuit, ArrowLeft, Repeat2, Sparkles, BrainCircuit as BrainIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "About — Recall",
  description: "Recall is a calm flashcard app built around spaced repetition and Claude AI.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased">
      {/* Nav */}
      <header className="border-b border-white/8 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/landing" className="flex items-center gap-2.5">
            <div className="rounded-xl bg-emerald-400/15 p-2 text-emerald-300">
              <BrainCircuit className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-white">Recall</span>
          </Link>
          <Link href="/landing" className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-20 space-y-16">
        {/* Hero */}
        <section className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">About</p>
          <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            For everyone who has felt perfectly understood in their own head —
            and perfectly lost the moment the words needed to come out.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-400">
            There is a particular silence — the one that arrives at exactly the wrong moment. When you
            know exactly what you feel, but the word won&apos;t surface. When a conversation ends and you
            find, walking home, the sentence you should have said.
          </p>
          <p className="max-w-2xl text-lg leading-8 text-slate-400">
            Recall is for people who live in that space. Who are done letting the right words come
            too late — and want to build, quietly and without pressure, the vocabulary that makes
            them feel at home in any room, any conversation, any moment that matters.
          </p>
        </section>

        {/* Origin */}
        <section className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-xl font-bold text-white">Why Recall exists</h2>
          <p className="text-slate-400 leading-7">
            The forgetting curve is one of the most replicated findings in cognitive science. Without
            deliberate review at the right intervals, most of what you read disappears within a week.
            Spaced repetition solves this — but existing tools are either too complex, too gamified,
            or too generic to build a real practice around.
          </p>
          <p className="text-slate-400 leading-7">
            Recall is designed to be minimal, focused, and useful. You capture something that matters.
            Claude helps you build a quality card in seconds. Then Recall tells you when to come back.
            That is the entire loop.
          </p>
        </section>

        {/* Principles */}
        <section className="space-y-8">
          <h2 className="text-xl font-bold text-white">What we believe</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { icon: Repeat2,   title: "Science over streaks", body: "SM-2 scheduling is more effective than gamification. We track your streak because consistency matters, not because it should be a game." },
              { icon: Sparkles,  title: "AI assists, you decide", body: "Claude drafts a definition. You edit it before it becomes a card. Your memory, your words, your learning." },
              { icon: BrainIcon, title: "Calm by design",        body: "No social features, no leaderboards, no engagement tricks. Recall is a tool, not an app trying to own your attention." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-semibold text-white">{title}</p>
                <p className="text-sm leading-6 text-slate-400">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Placeholder note */}
        <section className="rounded-3xl border border-dashed border-white/15 bg-white/[0.025] p-8 text-center space-y-3">
          <p className="text-sm font-medium text-slate-400">More coming here soon</p>
          <p className="text-xs text-slate-600">
            Team story, roadmap, and a longer manifesto are on the way.
          </p>
          <Link href="/contact" className="inline-block pt-1 text-sm text-emerald-400 transition hover:text-emerald-300">
            Get in touch →
          </Link>
        </section>
      </main>

      <footer className="border-t border-white/8 py-8 text-center text-xs text-slate-700">
        © {new Date().getFullYear()} Recall.{" "}
        <Link href="/landing" className="hover:text-slate-400 transition">Home</Link>
        {" · "}
        <Link href="/contact" className="hover:text-slate-400 transition">Contact</Link>
      </footer>
    </div>
  );
}
