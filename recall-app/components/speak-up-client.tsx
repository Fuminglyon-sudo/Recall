"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookmarkCheck, ChevronDown, ChevronRight, RotateCcw, Mic, History } from "lucide-react";

type Deck = { id: string; name: string };

type Category = "career" | "life" | "social";
type Difficulty = "easy" | "medium" | "hard";

type Scenario = {
  id: string;
  category: Category;
  tag: string;
  emoji: string;
  setting: string;
  question: string;
  personaQuestions?: Partial<Record<string, string>>;
  allowedPersonas?: string[];
};

type Persona = {
  id: string;
  label: string;
  description: string;
  aiPrompt: string;
};

type Message = {
  role: "speaker" | "listener";
  content: string;
};

type GradeResult = {
  score: number;
  strongPoints: string[];
  improvements: string[];
  modelAnswer: string;
  modelConversation?: Array<{ role: "speaker" | "listener"; content: string }>;
};

const CATEGORY_LABELS: Record<Category, string> = {
  career: "Career",
  life: "Life",
  social: "Social",
};

const CATEGORY_COLORS: Record<Category, string> = {
  career: "border-violet-300/20 bg-violet-400/10 text-violet-200",
  life: "border-amber-300/20 bg-amber-400/10 text-amber-200",
  social: "border-sky-300/20 bg-sky-400/10 text-sky-200",
};

const SCENARIOS: Scenario[] = [
  // Career
  {
    id: "interview-intro",
    category: "career",
    tag: "Job interview",
    emoji: "💼",
    setting: "You are in a job interview for a role you genuinely want. After the usual hellos, the interviewer settles in and asks the classic opener:",
    question: "Tell me about yourself — who you are, what you've been doing, and why you want this role.",
    personaQuestions: {
      friend: "Okay, I'm the interviewer — go. Introduce yourself like we're sitting across the table right now.",
      stranger: "Walk me through who you are and what you're going for. From scratch, like I know nothing about you.",
      "loved-one": "You've been preparing for this. Walk me through exactly how you're going to open — what you'd say in the room.",
    },
  },
  {
    id: "raise",
    category: "career",
    tag: "Asking for a raise",
    emoji: "📈",
    setting: "Your manager has just given you positive feedback in your quarterly review. There's a natural pause. You have prepared for this moment for weeks. They look at you and say:",
    question: "Is there anything else on your mind that you'd like to discuss?",
    personaQuestions: {
      friend: "Walk me through it — pretend you're in the room with your manager right now. What are you going to say?",
      stranger: "Give me the full picture. What's the situation and what are you planning to ask for?",
      "loved-one": "I want you to feel confident going in. Talk me through exactly what you're going to say.",
    },
  },
  {
    id: "idea-pitch",
    category: "career",
    tag: "Pitch an idea at work",
    emoji: "💡",
    setting: "Your team is in a standing meeting and your manager turns to you. You've been thinking about an idea that could genuinely help the team, and today is the day you finally bring it up:",
    question: "You mentioned you had something you wanted to share — go ahead, the floor is yours.",
    personaQuestions: {
      friend: "Run it by me. Pitch it like you're in the room — I'll tell you what actually lands.",
      stranger: "Explain it from scratch. What's the idea and why does it matter?",
      "loved-one": "You mentioned you have something to bring up at work. Walk me through it.",
    },
  },
  {
    id: "career-pivot",
    category: "career",
    tag: "Explaining a career change",
    emoji: "🔄",
    setting: "You are at a work dinner, seated next to someone senior in your industry. They seem genuinely curious when they find out about your background. They look up and ask:",
    question: "So you moved from [previous field] into this? What made you make that leap?",
    personaQuestions: {
      friend: "Help me understand it — why did you make the switch? Explain it like you're telling me over dinner.",
      "loved-one": "I've been curious about this change you made. Walk me through your thinking — why did you do it?",
    },
  },
  // Life
  {
    id: "what-do-you-do",
    category: "life",
    tag: "\"What do you do?\"",
    emoji: "🍽️",
    setting: "You are at a dinner party. Someone you've just met is genuinely curious — not making small talk. They lean in and say:",
    question: "So what do you actually do? Like, walk me through it — what does a typical day look like for you?",
    allowedPersonas: ["friend", "stranger", "skeptic", "senior"],
  },
  {
    id: "big-decision",
    category: "life",
    tag: "Defending a big decision",
    emoji: "🧭",
    setting: "Someone who cares about you — a parent, a close friend, a sibling — is worried about a significant decision you've made (moving, quitting, starting something, changing plans). They are not attacking you, but they are skeptical:",
    question: "I just don't understand — why would you do that? Help me understand what you are thinking.",
    allowedPersonas: ["friend", "skeptic", "loved-one"],
  },
  {
    id: "toast",
    category: "life",
    tag: "Making a toast",
    emoji: "🥂",
    setting: "You have been asked to give a short toast at your close friend's birthday or wedding. The room quiets, glasses raised, all eyes on you. Your friend smiles and nods:",
    question: "Say a few words about them.",
  },
  {
    id: "passion",
    category: "life",
    tag: "Explaining your passion",
    emoji: "🎨",
    setting: "You're at a casual dinner and you mention something you care about deeply — a hobby, a side project, a cause. The person next to you has never heard of it and seems genuinely curious:",
    question: "Wait, what does that even mean? What do you actually do when you do that?",
    allowedPersonas: ["friend", "manager", "stranger", "skeptic", "senior"],
  },
  // Social
  {
    id: "cold-start",
    category: "social",
    tag: "Starting a conversation",
    emoji: "🤝",
    setting: "You are at a social event — a party, a community gathering, an event — where you know only the host, who just walked away. Someone nearby makes eye contact and smiles but says nothing. The silence settles:",
    question: "(They're waiting for you to say something.)",
    personaQuestions: {
      friend: "(Your friend is standing in as a stranger for this one. They've just made eye contact and smiled — they're waiting for you to make the first move.)",
    },
    allowedPersonas: ["friend", "stranger", "skeptic"],
  },
  {
    id: "awkward-question",
    category: "social",
    tag: "Handling a tough personal question",
    emoji: "😬",
    setting: "You are at a family gathering or social event. Someone asks a direct question about your personal life that catches you completely off guard — about relationships, money, career, or a life choice. They mean well but the question stings a little:",
    question: "So are you still [doing that thing / with that person / in that situation]? What's happening with all that?",
    allowedPersonas: ["friend", "stranger", "skeptic", "loved-one"],
  },
  {
    id: "reconnect",
    category: "social",
    tag: "Reconnecting with an old friend",
    emoji: "🫂",
    setting: "You run into someone you were once very close to but drifted away from — an old friend, a former colleague, someone who mattered to you. The surprise of seeing them is mutual. They say:",
    question: "Oh wow, it's been years. Catch me up — what's been going on with you?",
    allowedPersonas: ["friend", "stranger", "skeptic", "loved-one"],
  },
  {
    id: "share-opinion",
    category: "social",
    tag: "Sharing a strong opinion",
    emoji: "💬",
    setting: "A group conversation has arrived at a topic where you have a clear point of view — one that not everyone might agree with. You've stayed quiet long enough. Someone turns to you and says:",
    question: "You've been quiet — what do you actually think about this?",
  },
];

const PERSONAS: Persona[] = [
  {
    id: "friend",
    label: "A close friend",
    description: "Warm, supportive — notices when you're holding back",
    aiPrompt: "You are a warm, close friend who genuinely wants this person to succeed. You've seen them nervous and you've seen them shine — you notice immediately when they're holding back or performing instead of being real. You listen with full attention, ask the follow-up questions no one else dares to, and get gently honest when something doesn't ring true.",
  },
  {
    id: "manager",
    label: "Your manager",
    description: "Professional, measured — rooting for you but needs substance",
    aiPrompt: "You are a composed, experienced manager who is actually rooting for this person — but you can't show it until they earn it. You've heard a thousand vague, rehearsed answers. Specific, honest, and confident earns your full attention. Anything that sounds safe or polished without substance makes you probe gently deeper. You appreciate directness above everything.",
  },
  {
    id: "stranger",
    label: "A curious stranger",
    description: "No context — one chance to earn their attention",
    aiPrompt: "You are a friendly, genuinely curious stranger with no background in what this person does or the choices they've made. You have no reason to care yet — they have one chance to say something that makes you lean in. You ask the questions an interested outsider would naturally ask, and you notice instantly when something doesn't quite make sense from the outside.",
  },
  {
    id: "skeptic",
    label: "A skeptic",
    description: "Not hostile — but generic claims bounce right off",
    aiPrompt: "You are thoughtful and a little skeptical — not unfriendly, but not easily impressed. Generic claims bounce right off you. A specific, honest, concrete detail earns more with you than ten polished sentences. You want to believe them — but they have to give you something real to hold onto.",
  },
  {
    id: "senior",
    label: "A senior figure",
    description: "Experienced — can tell instantly if you're performing",
    aiPrompt: "You are a senior, accomplished person who has had many conversations exactly like this one. You can tell in the first few seconds whether someone is performing or genuinely present. Something real and specific earns far more with you than anything safe or polished. You remember the people who surprised you.",
  },
  {
    id: "loved-one",
    label: "A worried loved one",
    description: "Loves you — which is exactly why they won't just nod",
    aiPrompt: "You are a family member or close friend who loves this person deeply — which is exactly why you won't just nod along. You know them better than they think you do. You will notice if they sound more confident here than they actually feel. Your questions come from care, not judgment — and you want them to walk into that room ready.",
  },
];

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Warm-up",
  medium: "Moderate",
  hard: "Challenging",
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: "border-emerald-300/20 bg-emerald-400/10 text-emerald-200",
  medium: "border-amber-300/20 bg-amber-400/10 text-amber-200",
  hard: "border-rose-300/20 bg-rose-400/10 text-rose-200",
};

type PracticeGoal = "opener" | "specificity" | "pushback" | "natural";

const PRACTICE_GOALS: { id: PracticeGoal; label: string; description: string; aiDescription: string }[] = [
  { id: "opener", label: "Opening strong", description: "Nail the first two sentences", aiDescription: "Opening strong — saying the right thing in the first two sentences" },
  { id: "specificity", label: "Being more specific", description: "Use concrete details, not vague language", aiDescription: "Being more specific — using concrete details instead of vague language" },
  { id: "pushback", label: "Handling pushback", description: "Stay grounded when challenged", aiDescription: "Handling pushback — staying grounded and clear when challenged or pressed" },
  { id: "natural", label: "Sounding natural", description: "Less rehearsed, more genuine", aiDescription: "Sounding natural — less rehearsed, more genuinely present in the moment" },
];

function scoreLabel(s: number): string {
  if (s >= 9) return "Crystal clear";
  if (s >= 7) return "Strong delivery";
  if (s >= 5) return "Solid foundation";
  if (s >= 3) return "Getting warmer";
  return "Keep practising";
}

const FILLER_WORDS = [
  "um", "uh", "er", "ah", "hmm",
  "you know", "kind of", "sort of",
  "basically", "literally", "actually",
];

function computeFillerMetrics(messages: Message[]): {
  fillerCount: number;
  totalWords: number;
  breakdown: [string, number][];
} {
  const speakerText = messages
    .filter((m) => m.role === "speaker")
    .map((m) => m.content)
    .join(" ")
    .toLowerCase();

  const totalWords = speakerText.split(/\s+/).filter(Boolean).length;
  const breakdown: [string, number][] = [];
  let fillerCount = 0;

  for (const filler of FILLER_WORDS) {
    const escaped = filler.replace(/\s+/g, "\\s+");
    const regex = new RegExp(`\\b${escaped}\\b`, "gi");
    const matches = speakerText.match(regex);
    if (matches && matches.length > 0) {
      breakdown.push([filler, matches.length]);
      fillerCount += matches.length;
    }
  }

  breakdown.sort(([, a], [, b]) => b - a);
  return { fillerCount, totalWords, breakdown };
}

function scoreColor(s: number): string {
  if (s >= 8) return "text-emerald-300";
  if (s >= 5) return "text-amber-300";
  return "text-red-300";
}

function scoreBorder(s: number): string {
  if (s >= 8) return "border-emerald-400/25 bg-emerald-400/8";
  if (s >= 5) return "border-amber-400/25 bg-amber-400/8";
  return "border-red-400/25 bg-red-400/8";
}

export function SpeakUpClient({
  decks = [],
  saveCardAction,
  strugglingWords = [],
}: {
  decks?: Deck[];
  saveCardAction?: (formData: FormData) => Promise<{ success?: boolean; error?: string }>;
  strugglingWords?: string[];
} = {}) {
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [active, setActive] = useState<Scenario | null>(null);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [practiceGoal, setPracticeGoal] = useState<PracticeGoal | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [exchangeCount, setExchangeCount] = useState(0);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedSession, setSavedSession] = useState(false);
  const [savingSession, setSavingSession] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [convOpen, setConvOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const activeQuestion = active && persona
    ? (active.personaQuestions?.[persona.id] ?? active.question)
    : active?.question ?? "";

  // ── Reset ──────────────────────────────────────────────────────────────────
  function reset() {
    setActive(null);
    setPersona(null);
    setPracticeGoal(null);
    setMessages([]);
    setDraft("");
    setExchangeCount(0);
    setResult(null);
    setError(null);
    setRecording(false);
    setSavedSession(false);
    setSaveError(false);
  }

  function retryOpening() {
    setMessages([]);
    setDraft("");
    setExchangeCount(0);
    setResult(null);
    setError(null);
    setSavedSession(false);
  }

  // ── Voice recording ────────────────────────────────────────────────────────
  async function startRecording() {
    setError(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SR) {
      setError("Speech recognition is not supported in this browser. Try Chrome or Edge, or type your answer.");
      return;
    }
    // Prime the mic permission before starting SpeechRecognition — Chrome's SR
    // API doesn't always inherit an existing permission grant without this step.
    try {
      const primer = await navigator.mediaDevices.getUserMedia({ audio: true });
      primer.getTracks().forEach((t) => t.stop());
    } catch (err) {
      const name = (err as { name?: string }).name;
      if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        setError("No microphone found. Connect one and try again, or just type your answer.");
        return;
      }
      if (name === "NotReadableError" || name === "TrackStartError") {
        setError("Microphone is in use by another app (Zoom, FaceTime, etc.). Close it and try again.");
        return;
      }
      // NotAllowedError or unknown: don't abort — SpeechRecognition uses a
      // different permission path and may still succeed.
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new SR() as any;
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    let accumulated = draft;
    recognition.onresult = (event: {
      resultIndex: number;
      results: { isFinal: boolean; 0: { transcript: string } }[];
    }) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) accumulated += event.results[i][0].transcript + " ";
        else interim += event.results[i][0].transcript;
      }
      setDraft(accumulated + interim);
    };
    recognition.onerror = (e: { error?: string }) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setError(
          "Microphone blocked. In Chrome: click the tune icon (sliders) in the address bar → Microphone → Allow. " +
          "In the installed app: use the ⋮ menu → Site settings → Microphone → Allow. Then refresh."
        );
      } else if (e.error === "network") {
        setError("Speech recognition needs an internet connection to Google's servers. Check your connection or type your answer instead.");
      } else if (e.error === "no-speech") {
        setError("No speech detected. Try speaking louder or closer to the microphone.");
      } else {
        setError("Speech recognition failed. Try again or type your answer.");
      }
      setRecording(false);
    };
    recognition.onend = () => setRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  }

  function stopRecording() {
    recognitionRef.current?.stop();
    setRecording(false);
  }

  // ── Send message ───────────────────────────────────────────────────────────
  async function sendMessage(force = false) {
    if (!active || !persona || (!draft.trim() && !force)) return;

    const userMessage: Message = { role: "speaker", content: draft.trim() };
    const nextMessages = draft.trim() ? [...messages, userMessage] : messages;
    const nextExchange = exchangeCount + (draft.trim() ? 1 : 0);

    if (draft.trim()) {
      setMessages(nextMessages);
      setDraft("");
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/speak-grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: `${active.setting}\n\nQuestion asked: "${activeQuestion}"`,
          personaPrompt: persona.aiPrompt,
          difficulty,
          messages: nextMessages,
          exchangeCount: nextExchange,
          forceEnd: force,
          practiceGoal: practiceGoal ? PRACTICE_GOALS.find((g) => g.id === practiceGoal)?.aiDescription : undefined,
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      const data = (await res.json()) as { type: string; followupQuestion?: string; score?: number; strongPoints?: string[]; improvements?: string[]; modelAnswer?: string; modelConversation?: Array<{ role: "speaker" | "listener"; content: string }> };

      if (data.type === "followup" && data.followupQuestion) {
        setMessages((prev) => [...prev, { role: "listener", content: data.followupQuestion! }]);
        setExchangeCount(nextExchange);
      } else if (data.type === "final") {
        const finalResult: GradeResult = {
          score: data.score ?? 5,
          strongPoints: data.strongPoints ?? [],
          improvements: data.improvements ?? [],
          modelAnswer: data.modelAnswer ?? "",
          modelConversation: data.modelConversation,
        };
        setResult(finalResult);
        setConvOpen(false);
        setExchangeCount(nextExchange);

        // Auto-save immediately using the result data from this closure
        if (active && persona) {
          setSavingSession(true);
          fetch("/api/speak-sessions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              scenarioId: active.id,
              scenarioTag: active.tag,
              personaId: persona.id,
              personaLabel: persona.label,
              difficulty,
              practiceGoal: practiceGoal ? PRACTICE_GOALS.find((g) => g.id === practiceGoal)?.label : null,
              exchangeCount: nextExchange,
              score: finalResult.score,
              strongPoints: finalResult.strongPoints,
              improvements: finalResult.improvements,
              modelAnswer: finalResult.modelAnswer,
              modelConversation: finalResult.modelConversation ?? null,
              messages: nextMessages,
            }),
          })
            .then((res) => { if (res.ok) setSavedSession(true); else setSaveError(true); })
            .catch(() => setSaveError(true))
            .finally(() => setSavingSession(false));
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── SETUP: pick scenario ───────────────────────────────────────────────────
  if (!active) {
    const visible = categoryFilter === "all" ? SCENARIOS : SCENARIOS.filter((s) => s.category === categoryFilter);

    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <Link
            href="/speak-up/history"
            className="flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-slate-300"
          >
            <History className="h-3.5 w-3.5" /> Session history
          </Link>
        </div>

        {/* Struggling words bridge */}
        {strugglingWords.length > 0 ? (
          <div className="rounded-[2rem] border border-amber-300/20 bg-amber-400/8 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">From your review</p>
            <p className="mt-2 text-sm text-slate-300">
              {strugglingWords.length === 1 ? "This word is" : "These words are"} not sticking yet. Pick any scenario and try to use {strugglingWords.length === 1 ? "it" : "one of them"} naturally in your answer.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {strugglingWords.map((w) => (
                <span key={w} className="rounded-full border border-amber-300/25 bg-amber-400/12 px-3 py-1 text-sm font-medium text-amber-200">{w}</span>
              ))}
            </div>
          </div>
        ) : null}

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          {(["all", "career", "life", "social"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                categoryFilter === cat
                  ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-200"
                  : "border-white/10 bg-white/5 text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat === "all" ? "All scenarios" : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Scenario grid */}
        <div className="grid gap-3 sm:grid-cols-2">
          {visible.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s)}
              className="rounded-3xl border border-white/10 bg-white/5 text-left transition hover:border-emerald-300/30 hover:bg-white/8 overflow-hidden"
            >
              <div className="relative h-36 w-full">
                <Image
                  src={`/scenerios/speak-up-${s.id}.webp`}
                  alt={s.tag}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                <span className={`absolute bottom-2.5 left-3 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${CATEGORY_COLORS[s.category]}`}>
                  {CATEGORY_LABELS[s.category]}
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-4">
                <span className="shrink-0 text-xl">{s.emoji}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{s.tag}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400 line-clamp-2">{s.setting}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── SETUP: pick persona + difficulty ──────────────────────────────────────
  if (!persona) {
    return (
      <div className="space-y-6">
        <button onClick={reset} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
          <ArrowLeft className="h-4 w-4" /> Back to scenarios
        </button>

        {/* Selected scenario recap */}
        <div className="rounded-[2rem] border border-white/10 bg-white/5 overflow-hidden">
          <div className="relative aspect-video w-full">
            <Image
              src={`/scenerios/speak-up-${active.id}.webp`}
              alt={active.tag}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-4 left-5 flex items-center gap-2">
              <span className="text-xl">{active.emoji}</span>
              <p className="font-semibold text-white">{active.tag}</p>
            </div>
          </div>
          <div className="p-5">
            <p className="text-sm leading-6 text-slate-300">{active.setting}</p>
            <p className="mt-3 text-sm font-medium text-emerald-300">&quot;{active.question}&quot;</p>
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">Difficulty</p>
          <div className="flex gap-3">
            {(["easy", "medium", "hard"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`flex-1 rounded-2xl border px-3 py-3 text-sm font-medium transition ${
                  difficulty === d ? DIFFICULTY_COLORS[d] : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                {DIFFICULTY_LABELS[d]}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {difficulty === "easy" && "Receptive and warm — great for building confidence."}
            {difficulty === "medium" && "Engaged and honest — will probe when something is vague."}
            {difficulty === "hard" && "Discerning — needs specifics and authenticity to be satisfied."}
          </p>
        </div>

        {/* Practice focus */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Practice focus <span className="font-normal normal-case tracking-normal text-slate-600">(optional)</span>
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {PRACTICE_GOALS.map((g) => (
              <button
                key={g.id}
                onClick={() => setPracticeGoal(practiceGoal === g.id ? null : g.id)}
                className={`rounded-2xl border px-3 py-3 text-left transition ${
                  practiceGoal === g.id
                    ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-200"
                    : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                <p className="text-sm font-medium">{g.label}</p>
                <p className="mt-0.5 text-xs opacity-70">{g.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Persona picker */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">Who are you practicing with?</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {(active.allowedPersonas
              ? PERSONAS.filter((p) => active.allowedPersonas!.includes(p.id))
              : PERSONAS
            ).map((p) => (
              <button
                key={p.id}
                onClick={() => setPersona(p)}
                className="rounded-3xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-emerald-300/30 hover:bg-white/8"
              >
                <p className="font-semibold text-white text-sm">{p.label}</p>
                <p className="mt-1 text-xs text-slate-400">{p.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── RESULTS ────────────────────────────────────────────────────────────────
  if (result) {
    return (
      <div className="space-y-5">
        {/* Score */}
        <div className={`rounded-[2rem] border p-6 text-center ${scoreBorder(result.score)}`}>
          <p className={`text-5xl font-bold tabular-nums ${scoreColor(result.score)}`}>{result.score}/10</p>
          <p className={`mt-2 text-lg font-semibold ${scoreColor(result.score)}`}>{scoreLabel(result.score)}</p>
          <p className="mt-1 text-sm text-slate-400">
            {active.emoji} {active.tag} · practiced with {persona.label.toLowerCase()} · {DIFFICULTY_LABELS[difficulty].toLowerCase()}
            {practiceGoal ? ` · ${PRACTICE_GOALS.find((g) => g.id === practiceGoal)?.label.toLowerCase() ?? ""}` : ""}
          </p>
        </div>

        {/* Strong points */}
        {result.strongPoints.length > 0 && (
          <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-400/8 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">What landed well</p>
            <ul className="space-y-2">
              {result.strongPoints.map((point, i) => (
                <li key={i} className="flex gap-2 text-sm text-emerald-100">
                  <span className="text-emerald-400 shrink-0">✓</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Improvements */}
        {result.improvements.length > 0 && (
          <div className="rounded-[2rem] border border-amber-300/20 bg-amber-400/8 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">Sharpen this</p>
            <ul className="space-y-2">
              {result.improvements.map((point, i) => (
                <li key={i} className="flex gap-2 text-sm text-amber-100">
                  <span className="text-amber-400 shrink-0">→</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Filler word metrics */}
        {(() => {
          const { fillerCount, totalWords, breakdown } = computeFillerMetrics(messages);
          if (totalWords === 0) return null;
          const pct = Math.round((fillerCount / totalWords) * 100);
          return (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Filler words</p>
              <div className="flex items-baseline gap-3">
                <p className="text-2xl font-bold tabular-nums text-white">{fillerCount}</p>
                <p className="text-sm text-slate-400">
                  across {totalWords} words
                  {fillerCount > 0 ? ` · ${pct}% filler rate` : " · no fillers detected"}
                </p>
              </div>
              {breakdown.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {breakdown.slice(0, 5).map(([word, count]) => (
                    <span key={word} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300">
                      &ldquo;{word}&rdquo; ×{count}
                    </span>
                  ))}
                </div>
              ) : null}
              {fillerCount === 0 ? (
                <p className="mt-2 text-xs text-emerald-300">Clean delivery — no filler words detected.</p>
              ) : pct <= 3 ? (
                <p className="mt-2 text-xs text-emerald-300">Low filler rate. Strong fluency.</p>
              ) : pct <= 8 ? (
                <p className="mt-2 text-xs text-amber-300">Moderate filler use. Try pausing instead of filling.</p>
              ) : (
                <p className="mt-2 text-xs text-rose-300">High filler rate. Silence is more powerful than &ldquo;um&rdquo;.</p>
              )}
            </div>
          );
        })()}

        {/* Model answer */}
        {result.modelAnswer && (
          <div className="rounded-[2rem] border border-violet-300/20 bg-violet-400/8 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-3">A stronger version</p>
            <p className="text-sm leading-7 text-violet-100 italic">&quot;{result.modelAnswer}&quot;</p>
          </div>
        )}

        {/* Save phrase */}
        {saveCardAction && decks.length > 0 && result.modelAnswer ? (
          <SavePhraseForm
            decks={decks}
            modelAnswer={result.modelAnswer}
            saveCardAction={saveCardAction}
          />
        ) : null}

        {/* How it could have gone */}
        {result.modelConversation && result.modelConversation.length > 0 ? (
          <div className="rounded-[2rem] border border-violet-300/20 bg-violet-400/5 p-5 space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-300">How it could have gone</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">One way this conversation could have flowed, if you had been at your best from the start.</p>
            </div>
            {result.modelConversation.map((m, i) => (
              <div key={i} className={`rounded-[2rem] border px-5 py-4 ${m.role === "speaker" ? "border-violet-300/20 bg-violet-400/8" : "border-white/8 bg-white/[0.03]"}`}>
                <p className={`mb-2 text-[10px] font-semibold uppercase tracking-widest ${m.role === "speaker" ? "text-violet-300" : "text-slate-500"}`}>
                  {m.role === "speaker" ? "You (model)" : persona.label}
                </p>
                <p className={`text-sm leading-7 ${m.role === "speaker" ? "font-medium text-white" : "text-slate-300"}`}>{m.content}</p>
              </div>
            ))}
          </div>
        ) : null}

        {/* Conversation review — collapsed by default */}
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03]">
          <button
            type="button"
            onClick={() => setConvOpen((v) => !v)}
            className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-white/[0.02]"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Your conversation</p>
            <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${convOpen ? "rotate-180" : ""}`} />
          </button>
          {convOpen ? (
            <div className="border-t border-white/8 p-5 space-y-4">
              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/8 p-3">
                <p className="text-xs text-emerald-300 mb-1 font-medium">Scenario</p>
                <p className="text-sm text-slate-300">{active.setting}</p>
                <p className="mt-2 text-sm font-medium text-emerald-200">&quot;{activeQuestion}&quot;</p>
              </div>
              {messages.map((m, i) => (
                <div key={i} className={`rounded-2xl border p-3 ${m.role === "speaker" ? "border-white/10 bg-white/5" : "border-slate-500/20 bg-slate-800/40"}`}>
                  <p className="text-xs text-slate-500 mb-1 font-medium">{m.role === "speaker" ? "You" : persona.label}</p>
                  <p className="text-sm text-slate-300">{m.content}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex gap-3">
          <button
            onClick={retryOpening}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-400/8 px-4 py-3 text-sm font-medium text-emerald-300 transition hover:bg-emerald-400/15 hover:text-emerald-200"
          >
            <RotateCcw className="h-4 w-4" />
            Try the opener again
          </button>
          <button
            onClick={reset}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/8 hover:text-white"
          >
            New scenario
          </button>
        </div>

        <div className={`flex items-center justify-center gap-2 rounded-[2rem] border px-4 py-3 text-sm font-medium ${
          savedSession
            ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
            : saveError
            ? "border-red-400/20 bg-red-400/8 text-red-300"
            : "border-white/10 bg-white/[0.03] text-slate-500"
        }`}>
          {savedSession ? (
            <><BookmarkCheck className="h-4 w-4" /> Session saved to history</>
          ) : saveError ? (
            <span>Session completed, but could not be saved. Check your connection.</span>
          ) : (
            <span>{savingSession ? "Saving session…" : "Session not saved"}</span>
          )}
          {savedSession ? (
            <Link href="/speak-up/history" className="ml-auto text-xs text-emerald-400/70 hover:text-emerald-300 transition">
              View history →
            </Link>
          ) : null}
        </div>
      </div>
    );
  }

  // ── CONVERSATION ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button onClick={reset} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className={`rounded-full border px-2 py-0.5 ${DIFFICULTY_COLORS[difficulty]}`}>{DIFFICULTY_LABELS[difficulty]}</span>
          <span>Practicing with: {persona.label}</span>
          {practiceGoal && <span className="text-emerald-400">· {PRACTICE_GOALS.find((g) => g.id === practiceGoal)?.label}</span>}
        </div>
      </div>

      {/* Scenario */}
      <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-400/8 overflow-hidden">
        <div className="relative aspect-video w-full">
          <Image
            src={`/scenerios/speak-up-${active.id}.webp`}
            alt={active.tag}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
          <p className="absolute bottom-4 left-5 text-xs font-semibold uppercase tracking-widest text-emerald-400">
            {active.emoji} {active.tag}
          </p>
        </div>
        <div className="p-5">
          <p className="text-sm leading-6 text-slate-300">{active.setting}</p>
          <p className="mt-3 text-sm font-semibold text-emerald-200">&quot;{activeQuestion}&quot;</p>
          {active.personaQuestions?.[persona.id] && (
            <p className="mt-2 text-xs text-emerald-400/60">
              Rehearsing with {persona.label.toLowerCase()} as your practice partner
            </p>
          )}
        </div>
      </div>

      {/* Message history */}
      {messages.length > 0 && (
        <div className="space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`rounded-2xl border p-4 ${m.role === "speaker" ? "border-white/10 bg-white/5" : "border-slate-500/20 bg-slate-800/40"}`}>
              <p className="text-xs text-slate-500 mb-1.5 font-medium">{m.role === "speaker" ? "You" : persona.label}</p>
              <p className="text-sm leading-6 text-slate-200">{m.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      {!loading && (
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={messages.length === 0 ? "Type your answer..." : "Continue the conversation..."}
            rows={4}
            className="w-full resize-none bg-transparent text-sm text-white placeholder-slate-500 outline-none leading-7"
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) sendMessage(); }}
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={recording ? stopRecording : startRecording}
              className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-medium transition ${
                recording
                  ? "border-rose-400/40 bg-rose-400/15 text-rose-300"
                  : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <Mic className="h-3.5 w-3.5" />
              {recording ? "Stop" : "Voice"}
            </button>
            <div className="flex-1" />
            {exchangeCount >= 2 && (
              <button
                onClick={() => sendMessage(true)}
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-400 hover:text-white transition"
              >
                End & get feedback
              </button>
            )}
            <button
              onClick={() => sendMessage()}
              disabled={!draft.trim()}
              className="flex items-center gap-2 rounded-2xl bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-40"
            >
              Send <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

function SavePhraseForm({
  decks,
  modelAnswer,
  saveCardAction,
}: {
  decks: Deck[];
  modelAnswer: string;
  saveCardAction: (formData: FormData) => Promise<{ success?: boolean; error?: string }>;
}) {
  const [open, setOpen] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState(modelAnswer);
  const [deckId, setDeckId] = useState(decks[0]?.id ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!front.trim() || !back.trim() || !deckId) return;
    setSaving(true);
    setSaveError(null);
    const fd = new FormData();
    fd.set("front", front.trim());
    fd.set("back", back.trim());
    fd.set("deckId", deckId);
    const res = await saveCardAction(fd);
    setSaving(false);
    if (res.success) setSaved(true);
    else setSaveError(res.error ?? "Failed to save");
  }

  if (saved) {
    return (
      <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-400/8 px-5 py-4">
        <p className="text-sm text-emerald-300">Saved to your deck — it will come up in your next review.</p>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-[2rem] border border-dashed border-white/15 px-4 py-3 text-sm text-slate-400 transition hover:border-white/25 hover:text-slate-300"
      >
        + Save a phrase from this session as a flashcard
      </button>
    );
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 space-y-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Save a phrase</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-2">
          <span className="text-xs font-medium text-slate-300">Phrase to remember</span>
          <input
            value={front}
            onChange={(e) => setFront(e.target.value)}
            placeholder="e.g. a word or line you want to own"
            className="input-base"
            required
          />
        </label>
        <label className="block space-y-2">
          <span className="text-xs font-medium text-slate-300">Definition / context</span>
          <textarea
            value={back}
            onChange={(e) => setBack(e.target.value)}
            rows={4}
            className="input-base"
            required
          />
        </label>
        <label className="block space-y-2">
          <span className="text-xs font-medium text-slate-300">Save to deck</span>
          <select
            value={deckId}
            onChange={(e) => setDeckId(e.target.value)}
            className="input-base"
          >
            {decks.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </label>
        {saveError ? <p className="text-xs text-red-400">{saveError}</p> : null}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!front.trim() || saving}
            className="flex-1 rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save to deck"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400 transition hover:text-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
