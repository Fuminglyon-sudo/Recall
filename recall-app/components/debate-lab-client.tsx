"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Mic, ArrowLeft, ChevronDown, History, RotateCcw } from "lucide-react";

type Category = "all" | "business" | "ethics" | "technology" | "personal";
type Difficulty = "easy" | "medium" | "hard";
type Position = "for" | "against";

type Motion = {
  id: string;
  category: Exclude<Category, "all">;
  emoji: string;
  text: string;
};

type OpponentType = {
  id: string;
  label: string;
  description: string;
  prompt: string;
};

type Message = { role: "user" | "opponent"; content: string };

type Feedback = {
  score: number;
  strongPoints: string[];
  improvements: string[];
  keyFallacy: string | null;
  missedArg: string;
  modelRebuttal: string;
};

const CATEGORY_LABELS: Record<Category, string> = {
  all: "All motions",
  business: "Business",
  ethics: "Ethics",
  technology: "Technology",
  personal: "Personal",
};

const CATEGORY_COLORS: Record<Exclude<Category, "all">, string> = {
  business: "border-amber-300/20 bg-amber-400/10 text-amber-200",
  ethics: "border-violet-300/20 bg-violet-400/10 text-violet-200",
  technology: "border-sky-300/20 bg-sky-400/10 text-sky-200",
  personal: "border-emerald-300/20 bg-emerald-400/10 text-emerald-200",
};

const MOTIONS: Motion[] = [
  { id: "m1", category: "business", emoji: "🏢", text: "Remote work is net negative for company culture" },
  { id: "m2", category: "business", emoji: "💰", text: "Startups should raise VC money only as a last resort" },
  { id: "m3", category: "business", emoji: "📊", text: "Performance-based pay does more harm than good" },
  { id: "m4", category: "business", emoji: "🔥", text: "Hustle culture destroys more careers than it builds" },
  { id: "m5", category: "business", emoji: "🤝", text: "Networking matters more than talent in most careers" },
  { id: "m6", category: "ethics", emoji: "⚖️", text: "Cancel culture does more harm than good" },
  { id: "m7", category: "ethics", emoji: "🔒", text: "Privacy matters more than national security" },
  { id: "m8", category: "ethics", emoji: "🏆", text: "Meritocracy is mostly a myth in corporate environments" },
  { id: "m9", category: "ethics", emoji: "📱", text: "Social media has done more harm than good overall" },
  { id: "m10", category: "ethics", emoji: "✈️", text: "Brain drain from developing countries ultimately benefits those countries" },
  { id: "m11", category: "technology", emoji: "🤖", text: "AI will create more jobs than it destroys in the next decade" },
  { id: "m12", category: "technology", emoji: "📡", text: "Social media platforms should be regulated like public utilities" },
  { id: "m13", category: "technology", emoji: "₿", text: "Cryptocurrency is doing more harm than good globally" },
  { id: "m14", category: "technology", emoji: "🔓", text: "Open-source AI development is more dangerous than beneficial" },
  { id: "m15", category: "technology", emoji: "🎯", text: "Algorithmic content feeds make people less informed, not more" },
  { id: "m16", category: "personal", emoji: "💥", text: "Failure is overrated as a teacher — success teaches more" },
  { id: "m17", category: "personal", emoji: "🎓", text: "Formal education is no longer the best path to success" },
  { id: "m18", category: "personal", emoji: "😌", text: "Ambition without contentment leads to unhappiness" },
  { id: "m19", category: "personal", emoji: "💪", text: "Vulnerability is a strength, not a weakness" },
  { id: "m20", category: "personal", emoji: "🧠", text: "Comfort zones should be escaped, not expanded gradually" },
];

const OPPONENT_TYPES: OpponentType[] = [
  {
    id: "skeptic",
    label: "The Skeptic",
    description: "Demands evidence for every claim. Never accepts assertions at face value.",
    prompt:
      "You are a rigorous skeptic. You challenge every claim that lacks evidence. You ask 'What's your proof for that?' and 'What does the data say?' You are not hostile, but you are relentless. You never accept a vague assertion when you can demand specifics. You concede a point only when it is genuinely supported. Your tone is cool, precise, and unforgiving of weak reasoning.",
  },
  {
    id: "idealist",
    label: "The Idealist",
    description: "Argues from values and principles. Unmoved by pure pragmatism.",
    prompt:
      "You are a principled idealist. You argue from values — justice, fairness, human dignity — not just from outcomes. When your opponent argues purely from consequences, you push back: 'But what kind of world does that create?' You are warm but firm. You refuse to let pragmatic arguments crowd out moral ones. You believe some things are worth defending regardless of their immediate utility.",
  },
  {
    id: "pragmatist",
    label: "The Pragmatist",
    description: "Only cares about real-world outcomes and evidence. Abstract values bore them.",
    prompt:
      "You are a hard-nosed pragmatist. You only care about what actually works. Abstract principles and moral arguments bore you unless they translate into real outcomes. You push back with 'But what does that mean in practice?' and 'Show me where that has actually worked.' You are direct, results-focused, and unimpressed by idealism. You will concede a point if someone shows you strong evidence.",
  },
  {
    id: "devils-advocate",
    label: "The Devil's Advocate",
    description: "Argues the opposing side with full conviction. Knows your position's weaknesses.",
    prompt:
      "You are a devil's advocate — you argue the opposing position with complete commitment, regardless of your personal views. You are there to find every weakness in your opponent's case. You anticipate their arguments and counter them preemptively. You bring up angles they probably haven't considered. You are precise, strategic, and intellectually aggressive. Your goal is to stress-test their thinking until it either breaks or becomes unbreakable.",
  },
];

const DIFFICULTY_MODIFIER: Record<Difficulty, string> = {
  easy:
    " DIFFICULTY: Easy — you occasionally acknowledge strong points from the debater and give them some openings. You are still a formidable opponent but you are not at full intensity.",
  medium:
    " DIFFICULTY: Medium — debate realistically. Push back clearly on weak arguments, acknowledge genuinely strong ones, and maintain a competitive but fair exchange.",
  hard:
    " DIFFICULTY: Hard — you are at your most formidable. Bring your strongest arguments, expose every logical gap, and give the debater almost no concessions. Force them to earn every point.",
};

function scoreLabel(s: number) {
  if (s >= 9) return "Masterful debater";
  if (s >= 7) return "Sharp and well-reasoned";
  if (s >= 5) return "Solid foundation";
  if (s >= 3) return "Building the skill";
  return "Needs more work";
}

function scoreColor(s: number) {
  if (s >= 8) return "text-emerald-300";
  if (s >= 5) return "text-amber-300";
  return "text-red-300";
}

function scoreBorder(s: number) {
  if (s >= 8) return "border-emerald-400/25 bg-emerald-400/8";
  if (s >= 5) return "border-amber-400/25 bg-amber-400/8";
  return "border-red-400/25 bg-red-400/8";
}

function UserBubble({ content, position }: { content: string; position: Position }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] space-y-1">
        <p className="text-right text-[10px] font-semibold uppercase tracking-widest text-amber-400">
          You ({position.toUpperCase()})
        </p>
        <div className="rounded-2xl rounded-tr-sm border border-amber-400/20 bg-amber-400/8 px-4 py-3">
          <p className="text-sm leading-6 text-slate-200">{content}</p>
        </div>
      </div>
    </div>
  );
}

function OpponentBubble({ content, opponentLabel }: { content: string; opponentLabel: string }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          {opponentLabel}
        </p>
        <div className="rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-sm leading-6 text-slate-300">{content}</p>
        </div>
      </div>
    </div>
  );
}

export function DebateLabClient() {
  const [categoryFilter, setCategoryFilter] = useState<Category>("all");
  const [activeMotion, setActiveMotion] = useState<Motion | null>(null);
  const [customMotion, setCustomMotion] = useState("");
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const [activeOpponent, setActiveOpponent] = useState<OpponentType>(OPPONENT_TYPES[0]);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [exchangeCount, setExchangeCount] = useState(0);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [convOpen, setConvOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const filteredMotions =
    categoryFilter === "all" ? MOTIONS : MOTIONS.filter((m) => m.category === categoryFilter);

  function opponentPromptWithDifficulty() {
    return activeOpponent.prompt + DIFFICULTY_MODIFIER[difficulty];
  }

  function pickPosition(p: Position | "surprise") {
    if (p === "surprise") {
      setPosition(Math.random() < 0.5 ? "for" : "against");
    } else {
      setPosition(p);
    }
  }

  function startDebate(motion: Motion) {
    setActiveMotion(motion);
    setMessages([]);
    setDraft("");
    setExchangeCount(0);
    setFeedback(null);
    setError(null);
    setSaved(false);
    setSaveError(false);
  }

  function reset() {
    setActiveMotion(null);
    setMessages([]);
    setDraft("");
    setExchangeCount(0);
    setFeedback(null);
    setError(null);
    setPosition(null);
    setShowCustomForm(false);
    setCustomMotion("");
    setSaved(false);
    setSaveError(false);
    stopRecording();
  }

  async function startRecording() {
    setError(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (SR) {
      try {
        const primer = await navigator.mediaDevices.getUserMedia({ audio: true });
        primer.getTracks().forEach((t) => t.stop());
      } catch (err) {
        const name = (err as { name?: string }).name;
        if (name === "NotFoundError" || name === "DevicesNotFoundError") {
          setError("No microphone found. Connect one and try again, or type your argument.");
          return;
        }
        if (name === "NotReadableError" || name === "TrackStartError") {
          setError("Microphone is in use by another app. Close it and try again.");
          return;
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recognition = new SR() as any;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      let final = "";
      recognition.onresult = (event: {
        resultIndex: number;
        results: { isFinal: boolean; 0: { transcript: string } }[];
      }) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) final += event.results[i][0].transcript + " ";
          else interim += event.results[i][0].transcript;
        }
        setDraft(final + interim);
      };
      recognition.onerror = (e: { error?: string }) => {
        if (e.error === "not-allowed" || e.error === "service-not-allowed") {
          setError(
            "Microphone blocked. In Chrome: click the tune icon (sliders) in the address bar → Microphone → Allow. Then refresh."
          );
        } else if (e.error === "network") {
          setError("Speech recognition needs an internet connection. Check your connection or type instead.");
        } else if (e.error === "no-speech") {
          setError("No speech detected. Try speaking louder or closer to the mic.");
        } else {
          setError("Speech recognition failed. Try again or type your argument.");
        }
      };
      recognition.onend = () => setRecording(false);
      recognition.start();
      recognitionRef.current = recognition;
      setRecording(true);
      return;
    }
    setError(
      "Speech recognition is not available in this browser. Use Chrome or Edge to speak, or type your argument below."
    );
  }

  function stopRecording() {
    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setRecording(false);
  }

  async function sendArgument() {
    if (!activeMotion || !position || !draft.trim()) return;
    stopRecording();

    const newMessages: Message[] = [...messages, { role: "user", content: draft.trim() }];
    const newExchangeCount = exchangeCount + 1;
    setMessages(newMessages);
    setDraft("");
    setExchangeCount(newExchangeCount);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/debate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motion: activeMotion.text,
          position,
          opponentType: activeOpponent.label,
          opponentPrompt: opponentPromptWithDifficulty(),
          messages: newMessages,
          exchangeCount: newExchangeCount,
          forceEnd: false,
        }),
      });

      if (!response.ok) {
        const err = (await response.json().catch(() => ({}))) as { error?: string };
        setError(response.status === 401
          ? "Your session has expired. Please refresh and log in again."
          : (err.error ?? "Request failed. Try again."));
        return;
      }

      const data = (await response.json()) as
        | { type: "response"; message: string }
        | { type: "feedback"; score: number; strongPoints: string[]; improvements: string[]; keyFallacy: string | null; missedArg: string; modelRebuttal: string };

      if (data.type === "response") {
        setMessages((prev) => [...prev, { role: "opponent", content: data.message }]);
      } else {
        setFeedback(data);
        autoSave(data, newMessages, newExchangeCount);
      }
    } catch {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function endDebate() {
    if (!activeMotion || !position) return;
    stopRecording();

    const finalMessages = messages;
    const finalCount = exchangeCount;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/debate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motion: activeMotion.text,
          position,
          opponentType: activeOpponent.label,
          opponentPrompt: opponentPromptWithDifficulty(),
          messages: finalMessages,
          exchangeCount: finalCount,
          forceEnd: true,
        }),
      });

      if (!response.ok) {
        const err = (await response.json().catch(() => ({}))) as { error?: string };
        setError(response.status === 401
          ? "Your session has expired. Please refresh and log in again."
          : (err.error ?? "Request failed. Try again."));
        return;
      }

      const data = (await response.json()) as {
        type: "feedback";
        score: number;
        strongPoints: string[];
        improvements: string[];
        keyFallacy: string | null;
        missedArg: string;
        modelRebuttal: string;
      };

      if (data.type !== "feedback" || typeof data.score !== "number") {
        setError("Feedback couldn't be generated. Please try again.");
        return;
      }

      setFeedback(data);
      autoSave(data, finalMessages, finalCount);
    } catch {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function autoSave(
    data: Feedback,
    msgs: Message[],
    count: number
  ) {
    if (!activeMotion || !position) return;
    setSaving(true);
    fetch("/api/debate-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        motion: activeMotion.text,
        position,
        opponentType: activeOpponent.label,
        difficulty,
        exchangeCount: count,
        score: data.score,
        strongPoints: data.strongPoints,
        improvements: data.improvements,
        keyFallacy: data.keyFallacy ?? null,
        missedArg: data.missedArg,
        modelRebuttal: data.modelRebuttal,
        messages: msgs,
      }),
    })
      .then((res) => { if (res.ok) setSaved(true); else setSaveError(true); })
      .catch(() => setSaveError(true))
      .finally(() => setSaving(false));
  }

  // ── Phase 1: Setup ──────────────────────────────────────────────────────────
  if (!activeMotion || !position) {
    return (
      <div className="space-y-8">
        <Link
          href="/debate-lab/history"
          className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <History className="h-4 w-4" />
          Session history
        </Link>

        {/* Motion selection */}
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Pick a motion</p>
            <p className="mt-1 text-sm text-slate-400">The proposition you will argue for or against.</p>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  categoryFilter === cat
                    ? "border-amber-400/40 bg-amber-400/15 text-amber-200"
                    : "border-white/10 bg-white/5 text-slate-400 hover:text-slate-200"
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {filteredMotions.map((motion) => (
              <button
                key={motion.id}
                onClick={() => setActiveMotion(motion)}
                className={`group rounded-2xl border p-4 text-left transition hover:border-amber-400/30 hover:bg-amber-400/5 ${
                  activeMotion?.id === motion.id
                    ? "border-amber-400/40 bg-amber-400/8"
                    : "border-white/8 bg-white/[0.02]"
                }`}
              >
                <span className="text-lg">{motion.emoji}</span>
                <p className="mt-2 text-sm font-medium leading-5 text-white">{motion.text}</p>
                <span className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${CATEGORY_COLORS[motion.category]}`}>
                  {motion.category}
                </span>
              </button>
            ))}
          </div>

          {/* Custom motion */}
          {!showCustomForm ? (
            <button
              onClick={() => setShowCustomForm(true)}
              className="text-sm text-slate-500 transition hover:text-slate-300"
            >
              + Write your own motion
            </button>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
              <p className="text-sm font-medium text-white">Custom motion</p>
              <input
                value={customMotion}
                onChange={(e) => setCustomMotion(e.target.value)}
                placeholder="e.g. Nigeria should adopt a four-day work week"
                className="input-base w-full"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const text = customMotion.trim();
                    if (!text) return;
                    setActiveMotion({ id: "custom", category: "personal", emoji: "✏️", text });
                    setShowCustomForm(false);
                    setCustomMotion("");
                  }}
                  disabled={!customMotion.trim()}
                  className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:opacity-50"
                >
                  Use this motion
                </button>
                <button onClick={() => setShowCustomForm(false)} className="text-sm text-slate-500 hover:text-slate-300">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Position + opponent + difficulty — shown once a motion is selected */}
        {activeMotion ? (
          <div className="space-y-6 rounded-[2rem] border border-amber-400/15 bg-amber-400/5 p-5 sm:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">Selected motion</p>
              <p className="mt-2 text-base font-semibold leading-6 text-white">{activeMotion.emoji} {activeMotion.text}</p>
            </div>

            {/* Position */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Your position</p>
              <div className="flex flex-wrap gap-2">
                {(["for", "against"] as Position[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPosition(p)}
                    className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                      position === p
                        ? p === "for"
                          ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-200"
                          : "border-red-400/40 bg-red-400/15 text-red-200"
                        : "border-white/10 bg-white/5 text-slate-300 hover:text-white"
                    }`}
                  >
                    {p === "for" ? "✓ For the motion" : "✗ Against the motion"}
                  </button>
                ))}
                <button
                  onClick={() => pickPosition("surprise")}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:text-white"
                >
                  🎲 Surprise me
                </button>
              </div>
              {position ? (
                <p className="text-xs text-slate-400">
                  You will argue <span className={`font-semibold ${position === "for" ? "text-emerald-300" : "text-red-300"}`}>{position === "for" ? "FOR" : "AGAINST"}</span> the motion.
                  {position !== null && customMotion === "" && " "}
                </p>
              ) : null}
            </div>

            {/* Opponent */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Opponent type</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {OPPONENT_TYPES.map((opp) => (
                  <button
                    key={opp.id}
                    onClick={() => setActiveOpponent(opp)}
                    className={`rounded-2xl border p-3 text-left transition ${
                      activeOpponent.id === opp.id
                        ? "border-amber-400/40 bg-amber-400/10"
                        : "border-white/8 bg-white/[0.02] hover:border-white/15"
                    }`}
                  >
                    <p className="text-sm font-semibold text-white">{opp.label}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{opp.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Intensity</p>
              <div className="flex gap-2">
                {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`rounded-2xl border px-4 py-2 text-sm font-semibold capitalize transition ${
                      difficulty === d
                        ? d === "easy"
                          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                          : d === "hard"
                          ? "border-red-400/30 bg-red-400/10 text-red-200"
                          : "border-amber-400/30 bg-amber-400/10 text-amber-200"
                        : "border-white/10 bg-white/5 text-slate-300 hover:text-white"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => { if (position) startDebate(activeMotion); }}
              disabled={!position}
              className="w-full rounded-2xl bg-amber-400 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Start debate
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  // ── Phase 2 & 3: Active debate / Feedback ───────────────────────────────────
  if (feedback) {
    return (
      <div className="space-y-5">
        {/* Score */}
        <div className={`rounded-[2rem] border p-5 ${scoreBorder(feedback.score)}`}>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Debate score</p>
          <div className="mt-2 flex items-baseline gap-3">
            <span className={`text-5xl font-bold tabular-nums ${scoreColor(feedback.score)}`}>
              {feedback.score}
            </span>
            <span className="text-lg text-slate-500">/10</span>
            <span className={`text-sm font-semibold ${scoreColor(feedback.score)}`}>
              — {scoreLabel(feedback.score)}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Motion: <span className="text-slate-300">{activeMotion.text}</span> · You argued{" "}
            <span className={position === "for" ? "text-emerald-300 font-semibold" : "text-red-300 font-semibold"}>
              {position.toUpperCase()}
            </span>
            {" · "}vs {activeOpponent.label}
          </p>
        </div>

        {/* Strong points */}
        {feedback.strongPoints.length > 0 ? (
          <div className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/5 p-5 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">What landed</p>
            {feedback.strongPoints.map((p, i) => (
              <p key={i} className="text-sm leading-6 text-slate-200">{p}</p>
            ))}
          </div>
        ) : null}

        {/* Improvements */}
        {feedback.improvements.length > 0 ? (
          <div className="rounded-[2rem] border border-amber-400/20 bg-amber-400/5 p-5 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">What to sharpen</p>
            {feedback.improvements.map((p, i) => (
              <p key={i} className="text-sm leading-6 text-slate-200">{p}</p>
            ))}
          </div>
        ) : null}

        {/* Fallacy */}
        {feedback.keyFallacy ? (
          <div className="rounded-[2rem] border border-red-400/20 bg-red-400/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-400">Logical fallacy detected</p>
            <p className="mt-2 text-sm leading-6 text-slate-200">{feedback.keyFallacy}</p>
          </div>
        ) : null}

        {/* Missed argument */}
        <div className="rounded-[2rem] border border-violet-400/20 bg-violet-400/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Argument you missed</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">{feedback.missedArg}</p>
        </div>

        {/* Model rebuttal */}
        <div className="rounded-[2rem] border border-sky-400/20 bg-sky-400/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-400">How to handle their hardest challenge</p>
          <p className="mt-2 text-sm leading-6 text-slate-200 italic">&ldquo;{feedback.modelRebuttal}&rdquo;</p>
        </div>

        {/* Conversation transcript */}
        <div className="rounded-[2rem] border border-white/8 bg-white/[0.02]">
          <button
            type="button"
            onClick={() => setConvOpen((v) => !v)}
            className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-white/[0.02]"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Your debate</p>
            <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${convOpen ? "rotate-180" : ""}`} />
          </button>
          {convOpen ? (
            <div className="border-t border-white/8 p-5 space-y-4">
              {messages.map((msg, i) =>
                msg.role === "user" ? (
                  <UserBubble key={i} content={msg.content} position={position} />
                ) : (
                  <OpponentBubble key={i} content={msg.content} opponentLabel={activeOpponent.label} />
                )
              )}
            </div>
          ) : null}
        </div>

        {/* Save status */}
        {saving ? (
          <p className="text-xs text-slate-500">Saving session…</p>
        ) : saved ? (
          <div className="flex items-center gap-3 text-xs">
            <span className="text-emerald-400">Session saved to history</span>
            <Link href="/debate-lab/history" className="text-emerald-300 transition hover:text-emerald-200">
              View history →
            </Link>
          </div>
        ) : saveError ? (
          <p className="text-xs text-red-400">Session completed, but could not be saved. Check your connection.</p>
        ) : null}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              setFeedback(null);
              setMessages([]);
              setDraft("");
              setExchangeCount(0);
              setSaved(false);
              setSaveError(false);
            }}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <RotateCcw className="mr-2 inline h-3.5 w-3.5" />
            Debate same motion again
          </button>
          <button
            onClick={reset}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
          >
            Try a new motion
          </button>
        </div>
      </div>
    );
  }

  // ── Active debate ─────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
              position === "for"
                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                : "border-red-400/30 bg-red-400/10 text-red-300"
            }`}>
              {position === "for" ? "For" : "Against"}
            </span>
            <span className="text-xs text-slate-500">vs {activeOpponent.label} · {difficulty}</span>
          </div>
          <p className="mt-1.5 text-sm font-semibold leading-5 text-white">{activeMotion.text}</p>
        </div>
        <button
          onClick={reset}
          className="shrink-0 rounded-xl p-2 text-slate-500 transition hover:text-slate-300"
          aria-label="Exit debate"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Thread */}
      <div className="min-h-48 space-y-4 rounded-[2rem] border border-white/8 bg-white/[0.02] p-4">
        {messages.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            Make your opening argument — state your position and your strongest reason for it.
          </p>
        ) : (
          messages.map((msg, i) =>
            msg.role === "user" ? (
              <UserBubble key={i} content={msg.content} position={position} />
            ) : (
              <OpponentBubble key={i} content={msg.content} opponentLabel={activeOpponent.label} />
            )
          )
        )}
        {loading ? (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-4 py-3">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500" style={{ animationDelay: `${i * 120}ms` }} />
                ))}
              </div>
            </div>
          </div>
        ) : null}
        <div ref={threadEndRef} />
      </div>

      {/* Error */}
      {error ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/8 px-4 py-3">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      ) : null}

      {/* Input */}
      <div className="space-y-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              void sendArgument();
            }
          }}
          placeholder="Make your argument…"
          rows={3}
          className="input-base w-full resize-none"
          disabled={loading}
        />
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              onClick={recording ? stopRecording : () => void startRecording()}
              disabled={loading}
              className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${
                recording
                  ? "border-red-400/30 bg-red-400/10 text-red-300 hover:bg-red-400/15"
                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              <Mic className={`h-4 w-4 ${recording ? "animate-pulse" : ""}`} />
              {recording ? "Stop" : "Speak"}
            </button>
            {exchangeCount >= 3 ? (
              <button
                onClick={() => void endDebate()}
                disabled={loading}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-400 transition hover:text-white disabled:opacity-50"
              >
                End & get feedback
              </button>
            ) : null}
          </div>
          <button
            onClick={() => void sendArgument()}
            disabled={loading || !draft.trim()}
            className="rounded-2xl bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Thinking…" : "Send"}
          </button>
        </div>
        <p className="text-[10px] text-slate-600">Cmd/Ctrl + Enter to send · {5 - exchangeCount} exchange{5 - exchangeCount !== 1 ? "s" : ""} remaining</p>
      </div>
    </div>
  );
}
