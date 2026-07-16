"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Is Soro Soke really free?",
    a: "The first 50 accounts are completely free — forever. No card, no trial, no expiry. If there are still founder spots available when you sign up, your account is yours for life. Once those 50 spots fill, new accounts get a 14-day free trial with full access before choosing Pro at $9.99/month or $99/year.",
  },
  {
    q: "What is spaced repetition?",
    a: "Spaced repetition is a learning technique that schedules reviews at increasing intervals over time. Instead of reviewing everything every day, you only review a card when you're about to forget it. Soro Soke uses the SM-2 algorithm — the same one that powers Anki and SuperMemo — to calculate these intervals automatically.",
  },
  {
    q: "How does Soro Soke card drafting work?",
    a: "When you type a word or concept into a new card, Soro Soke generates a definition, a memory hook, an example sentence, and synonyms in seconds. You can edit any of it before saving. The goal is to cut the time it takes to create a good card from minutes to seconds.",
  },
  {
    q: "What is free recall and why does it matter?",
    a: "Free recall means retrieving information from memory without any cues — like writing down everything you remember from a deck before you flip any cards. Research consistently shows it produces stronger memory than passive re-reading. Soro Soke makes it a first-class part of your review session.",
  },
  {
    q: "Can I use Soro Soke for languages other than English?",
    a: "Yes. Soro Soke works for any vocabulary in any language. Soro Soke's card drafting supports multiple languages — just type the word in the language you're studying and it will respond accordingly.",
  },
  {
    q: "How do I get my cards into Soro Soke?",
    a: "You can add cards one at a time (with Soro Soke's drafting), or import a CSV file in bulk. Each deck has an export button too, so you can back up your cards or move them between accounts.",
  },
  {
    q: "What happens when I delete my account?",
    a: "Deleting your account permanently removes all your decks, cards, review history, and profile data. You can do this from Settings → Delete account. It requires typing your email address to confirm — there is no undo.",
  },
  {
    q: "What devices can I use Soro Soke on?",
    a: "Soro Soke is a web app that works in any modern browser — Chrome, Safari, Firefox, Edge. It's fully mobile-responsive, so it works well on your phone or tablet without needing to install anything. A native iOS and Android app is on the roadmap.",
  },
  {
    q: "Does Soro Soke work offline?",
    a: "Partially. If you lose your connection mid-review, Soro Soke detects it and holds the grading buttons until you reconnect — so you never accidentally lose a session. Features that require AI (card drafting, Speak Up, Conversation Lab) need an active connection. Full offline review caching for commutes is on the roadmap.",
  },
  {
    q: "Does Soro Soke track my streak or daily progress?",
    a: "Yes. Your dashboard shows your current review streak, a 30-day activity heatmap, total cards mastered, and the next 8 days of upcoming reviews so you can see what's coming. Consistency over long periods matters more than any single session — the streak is there to reflect that, not to guilt you.",
  },
  {
    q: "How many cards will I need to review each day?",
    a: "That depends on how many cards you have and how well you know them. Soro Soke introduces 3 new cards per day by default. Most consistent users have a daily queue of 10–25 cards, which takes 5–10 minutes. The key is not letting the queue pile up — daily short sessions beat infrequent long ones by a significant margin.",
  },
  {
    q: "What happens if I miss a day?",
    a: "Nothing catastrophic. Your due cards wait for you. If you miss several days, more cards will be due when you return — Soro Soke prioritises overdue cards first so you work through the backlog efficiently. Your streak resets, but your card mastery and review history are untouched.",
  },
  {
    q: "What do the review grades mean?",
    a: "There are six grades, each telling the algorithm how strongly you recalled the card. Blackout (0) — no memory at all, card returns within minutes. Wrong (1) — incorrect recall, returns shortly. Hard (2) — correct but required serious effort, interval shortens. Okay (3) — correct with hesitation, kept close to its current schedule. Good (4) — correct with only a brief hesitation, interval extends. Perfect (5) — instant, effortless recall, interval extends significantly. Grading yourself honestly — not generously — is what makes the algorithm work well over time.",
  },
  {
    q: "What do the mastery levels — New, Learning, Familiar, Mastered — mean?",
    a: "New means the card hasn't been reviewed yet. Learning means you've reviewed it but it's still in early repetition — coming back frequently. Familiar means consistent good recall over several sessions — intervals are stretching into weeks. Mastered means strong, reliable recall across many sessions — the card surfaces infrequently, maybe monthly. Cards move up and down based on your grades.",
  },
  {
    q: "Can I share a deck with someone else?",
    a: "Yes — deck sharing is live. From any deck page, generate a share link. Anyone with the link can preview the cards and clone the entire deck to their own account in one click. You can revoke the link at any time.",
  },
  {
    q: "Is my data private? Can anyone see my Speak Up sessions?",
    a: "Your sessions are private. Speak Up conversations and Conversation Lab exchanges are not stored beyond the session — they exist to give you feedback, not to build a record. Your card data is tied to your account and never shared or sold.",
  },
  {
    q: "How is Soro Soke different from Anki or Quizlet?",
    a: "Anki uses the same SM-2 algorithm as Soro Soke and is powerful — but it requires you to build everything yourself and has a steep learning curve. Quizlet is primarily a recognition tool with limited scheduling depth. Soro Soke adds Soro Soke-drafted cards (no blank-card friction), Speak Up for high-stakes speaking practice, and Conversation Lab for social fluency. It's built for professionals who want to communicate better — not students drilling for exams.",
  },
  {
    q: "What's the difference between Speak Up and Conversation Lab?",
    a: "Speak Up is for high-stakes prepared scenarios — a job interview, a salary negotiation, a pitch, pushing back on a decision. You rehearse before a specific kind of moment happens. Conversation Lab is for social fluency — you open a conversation in a natural setting (a networking event, a long flight, a dinner party) with no script or guided prompts, then get coaching on your conversational moves. One builds professional confidence under pressure; the other builds social ease.",
  },
  {
    q: "How does Speak Up scoring work?",
    a: "After a Speak Up session you receive a score from 0–10, a breakdown of what landed well, specific areas to sharpen, a filler-word count tracking verbal habits like 'um' and 'uh', a model response showing how your answer could have landed better, and an idealized version of the full conversation — how it could have gone if you had been at your best from the start. The score reflects clarity, structure, how well you held your position, and your verbal delivery.",
  },
  {
    q: "What is Debate Lab?",
    a: "Debate Lab puts you in a structured debate against an AI opponent. Pick a formal motion (like 'AI should be regulated by governments') or describe a real-life situation — a salary push, a product decision, a disagreement with a colleague. Choose your position, study the prep room, then go five exchanges with an AI that argues back and adapts to your points. Afterward you receive a score, argument-by-argument feedback, skill sub-scores across five dimensions, and a full coaching debrief.",
  },
  {
    q: "How is Debate Lab different from Speak Up?",
    a: "Speak Up is one-sided and coaching-focused — you rehearse delivering a response (a pitch, an interview answer, a negotiation opener) and the AI evaluates it. Debate Lab is adversarial and interactive — the AI argues back, challenges your logic, and tries to win. It's the difference between rehearsing a speech and actually being challenged in a meeting.",
  },
  {
    q: "How does Debate Lab scoring work?",
    a: "After five exchanges you receive an overall score from 0–100, a Win/Draw/Loss verdict, and skill sub-scores across five dimensions: Clarity, Evidence, Rebuttal, Logic, and Composure. You also get an argument-by-argument breakdown (each exchange rated Strong, Okay, or Weak), your opponent's strongest point, and the best counterargument you missed.",
  },
  {
    q: "What is the Debate Lab prep room?",
    a: "Before the debate begins, the prep room gives you three key arguments to lead with, two likely attacks your opponent will make (each with a suggested rebuttal), and one thing to watch out for based on your motion and the opponent type you chose. Read it, prepare, and enter when you're ready.",
  },
  {
    q: "What does the audience sway meter show?",
    a: "The sway meter tracks how the imagined audience's opinion shifts in real time across each exchange. A strong point swings the meter toward you; a weak or conceded point swings it back. By the end you can see the cumulative arc of the debate and which exchanges moved the needle most — not just your final score.",
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
            aria-expanded={open === i}
          >
            <span className="text-sm font-medium text-white">{item.q}</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                open === i ? "rotate-180" : ""
              }`}
            />
          </button>
          {/* Answer always in DOM for SEO — hidden visually when collapsed */}
          <div
            className="border-t border-white/8 px-6 text-sm leading-7 text-slate-400 transition-all duration-200"
            style={open === i ? { paddingTop: "1rem", paddingBottom: "1.25rem" } : { maxHeight: 0, overflow: "hidden", paddingTop: 0, paddingBottom: 0, borderTopWidth: 0 }}
            aria-hidden={open !== i}
          >
            {item.a}
          </div>
        </div>
      ))}
    </div>
  );
}
