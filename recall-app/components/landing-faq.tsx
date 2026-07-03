"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Is Summon really free?",
    a: "Yes — Summon is free to use. Sign in with Google and your account is ready instantly. There are no paywalled features, no trial periods, and no card required.",
  },
  {
    q: "What is spaced repetition?",
    a: "Spaced repetition is a learning technique that schedules reviews at increasing intervals over time. Instead of reviewing everything every day, you only review a card when you're about to forget it. Summon uses the SM-2 algorithm — the same one that powers Anki and SuperMemo — to calculate these intervals automatically.",
  },
  {
    q: "How does the AI card drafting work?",
    a: "When you type a word or concept into a new card, Summon sends it to Claude (Anthropic's AI model). Claude returns a definition, a memory hook, an example sentence, and synonyms. You can edit any of it before saving. The goal is to cut the time it takes to create a good card from minutes to seconds.",
  },
  {
    q: "What is free recall and why does it matter?",
    a: "Free recall means retrieving information from memory without any cues — like writing down everything you remember from a deck before you flip any cards. Research consistently shows it produces stronger memory than passive re-reading. Summon makes it a first-class part of your review session.",
  },
  {
    q: "Can I use Summon for languages other than English?",
    a: "Yes. Summon works for any vocabulary in any language. The AI drafting supports multiple languages — just type the word in the language you're studying and Claude will respond accordingly.",
  },
  {
    q: "How do I get my cards into Summon?",
    a: "You can add cards one at a time (with AI drafting), or import a CSV file in bulk. Each deck has an export button too, so you can back up your cards or move them between accounts.",
  },
  {
    q: "What happens when I delete my account?",
    a: "Deleting your account permanently removes all your decks, cards, review history, and profile data. You can do this from Settings → Delete account. It requires typing your email address to confirm — there is no undo.",
  },
];

export function LandingFaq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {FAQS.map((item, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-white/15"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
          >
            <span className="text-sm font-medium text-white">{item.q}</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                open === i ? "rotate-180" : ""
              }`}
            />
          </button>
          {open === i && (
            <div className="border-t border-white/8 px-6 pb-5 pt-4 text-sm leading-7 text-slate-400">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
