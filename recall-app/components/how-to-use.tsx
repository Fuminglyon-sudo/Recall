"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const GRADES = [
  { value: "0", label: "Blackout", desc: "Complete blank — couldn't recall anything at all." },
  { value: "1", label: "Wrong", desc: "Had an answer, but it was incorrect." },
  { value: "2", label: "Hard", desc: "Correct but required serious effort to retrieve." },
  { value: "3", label: "Okay", desc: "Recalled correctly, but it felt effortful." },
  { value: "4", label: "Good", desc: "Correct with only a brief hesitation." },
  { value: "5", label: "Perfect", desc: "Instant, effortless recall — no doubt at all." },
];

const MASTERY = [
  { label: "New", desc: "Just added. Not reviewed yet.", color: "text-slate-400", dot: "bg-slate-500" },
  { label: "Learning", desc: "Reviewed but still shaky. Returns often.", color: "text-orange-300", dot: "bg-orange-400" },
  { label: "Familiar", desc: "Returning consistently. Building momentum.", color: "text-sky-300", dot: "bg-sky-400" },
  { label: "Mastered", desc: "Solid. Surfaces only for occasional refresh.", color: "text-emerald-300", dot: "bg-emerald-400" },
];

const TABS = [
  {
    name: "Today",
    href: "/today",
    desc: "Your daily review queue. Shows up to 6 cards mixed across all your decks — oldest due first. Cards overdue from a previous day are tagged Overdue so you clear backlogs before they stack up.",
  },
  {
    name: "Pitch Practice",
    href: "/pitch-practice",
    desc: "Scenario-based pitch simulations for Japa Reality and Sharpen. An AI investor asks you a question, you respond (type or record), and it follows up with probing questions. After 2–5 exchanges you get a score, strong points, and a model answer.",
  },
  {
    name: "Social Skills Lab",
    href: "/social-skills",
    desc: "10 real-world social scenarios — airplane, networking mixer, wedding, coffee queue, elevator, and more. Pick a character type (Introvert, Extrovert, Hard to Read…), open the conversation yourself, and get coaching feedback plus one power move to try next time.",
  },
  {
    name: "Founder Words",
    href: "/founder-words",
    desc: "Paste context about your product or a recent conversation and the AI generates 3–5 precise vocabulary cards (word, definition, example, memory hook) that you can save directly into any deck.",
  },
  {
    name: "Corporate Jargon",
    href: "/corporate-jargon",
    desc: "A searchable library of 50+ professional terms you will hear in meetings, boardrooms, and business conversations — from circle back and hard stop to boiling the ocean and moving the needle. Click any term to expand its definition, example, and memory hook.",
  },
  {
    name: "Decks",
    href: "/decks",
    desc: "Browse all your vocabulary collections. Each deck shows how many cards are due, the mastery breakdown, and a link to study or add to it.",
  },
  {
    name: "Add card",
    href: "/cards/new",
    desc: "Manually save a new word, phrase, or memory. Type the front and the AI drafts a definition, example, hook, and synonyms you can edit before saving.",
  },
];

export function HowToUse() {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-white/[0.03]"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-white">How to use Recall</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] text-slate-500">
            guide
          </span>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-slate-500" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
        )}
      </button>

      {open ? (
        <div className="space-y-7 border-t border-white/8 px-6 py-6">

          {/* How spaced repetition works */}
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-500">How it works</p>
            <p className="text-sm leading-7 text-slate-300">
              Recall uses{" "}
              <span className="font-medium text-white">spaced repetition</span> — cards you know
              well come back less often; cards you struggle with return sooner. Each day shows you
              up to <span className="font-medium text-white">6 cards</span>, mixed across all your
              decks so you always get variety. Grade yourself honestly and the algorithm does the
              rest. If you miss a day, overdue cards are tagged{" "}
              <span className="font-medium text-amber-300">Overdue</span> so you can clear them
              first before fresh cards are added.
            </p>
          </div>

          {/* What's in the app */}
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-500">What&apos;s in the app</p>
            <div className="space-y-2">
              {TABS.map(({ name, desc }) => (
                <div key={name} className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                  <p className="text-xs font-semibold text-white">{name}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Grading scale */}
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-500">Grading scale (0 – 5)</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {GRADES.map(({ value, label, desc }) => (
                <div key={value} className="rounded-2xl border border-white/8 bg-white/[0.02] p-3">
                  <p className="text-xs font-semibold text-white">
                    {value} — {label}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mastery levels */}
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-500">Mastery levels</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {MASTERY.map(({ label, desc, color, dot }) => (
                <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.02] p-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                    <p className={`text-xs font-semibold ${color}`}>{label}</p>
                  </div>
                  <p className="mt-1.5 text-xs leading-5 text-slate-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs leading-6 text-slate-500">
            Grade honestly — the algorithm only works when your ratings match your actual recall.
            Giving yourself a 5 when it was really a 3 just delays the moment you truly learn it.
          </p>
        </div>
      ) : null}
    </div>
  );
}
