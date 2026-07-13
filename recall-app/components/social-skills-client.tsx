"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mic, ArrowLeft, ChevronDown, ChevronRight, RotateCcw, Flag, History } from "lucide-react";

type Category = "all" | "professional" | "social" | "everyday";
type Difficulty = "easy" | "medium" | "hard";

type Scenario = {
  id: string;
  category: "professional" | "social" | "everyday";
  tag: string;
  emoji: string;
  context: string;
  prompt: string;
  tension?: string;
  hint?: string;
};

type CharacterType = {
  id: string;
  label: string;
  description: string;
  aiPrompt: string;
};

type Message = {
  role: "user" | "character";
  content: string;
};

type FeedbackResult = {
  score: number;
  strongPoints: string[];
  improvements: string[];
  powerMove: string;
  turningPoint?: string;
  modelConversation?: Array<{ role: "user" | "character"; content: string }>;
};

const CATEGORY_LABELS: Record<Category, string> = {
  all: "All scenarios",
  professional: "Professional",
  social: "Social events",
  everyday: "Everyday life",
};

const CATEGORY_COLORS: Record<Exclude<Category, "all">, string> = {
  professional: "border-violet-300/20 bg-violet-400/10 text-violet-200",
  social: "border-sky-300/20 bg-sky-400/10 text-sky-200",
  everyday: "border-emerald-300/20 bg-emerald-400/10 text-emerald-200",
};

const SCENARIOS: Scenario[] = [
  {
    id: "airplane",
    category: "everyday",
    tag: "Long-haul flight",
    emoji: "✈️",
    context:
      "You are on a 6-hour flight. You settle into your window seat and the stranger next to you glances up briefly, nods, then goes back to what they were doing. You have hours ahead of you.",
    prompt: "Break the ice. Say whatever feels natural to start a conversation.",
    tension: "You are tired after a long work week and almost cancelled this trip. You are open to conversation but it needs to feel natural, not forced.",
    hint: "Lead with a low-pressure observation about the flight or the seat — don't open with a question. Let them choose how much to engage.",
  },
  {
    id: "networking",
    category: "professional",
    tag: "Professional mixer",
    emoji: "🥂",
    context:
      "You are at a professional networking event — name tags on, drinks in hand, soft background music. You spot someone standing alone near the edge of the room, looking around.",
    prompt: "You walk over. Start the conversation.",
    tension: "You have already had two forgettable conversations tonight and are thinking about leaving early. If this next conversation is interesting, you will stay.",
    hint: "Ask what brought them here specifically, not what they do. Genuine curiosity cuts through pleasantries immediately at professional events.",
  },
  {
    id: "wedding",
    category: "social",
    tag: "Wedding reception",
    emoji: "💒",
    context:
      "You are at a wedding reception. You know the couple well but almost nobody else at your table. The person sitting next to you has been quietly eating while the speeches played. The speeches just ended.",
    prompt: "The room relaxes. Say something to get the conversation going.",
    tension: "You know the couple well but feel slightly out of place among people who all seem to know each other already. You are quietly glad someone is starting a conversation.",
    hint: "Use the shared moment as your anchor — the speeches, the couple, the room. A light observational comment lands better than a direct question.",
  },
  {
    id: "coffee",
    category: "everyday",
    tag: "Coffee shop queue",
    emoji: "☕",
    context:
      "You are waiting in a long queue at a busy coffee shop. The person ahead of you has been waiting just as long. You have both been quietly watching the baristas scramble during the morning rush.",
    prompt: "You decide to say something. What comes out?",
    tension: "The wait has been annoying — longer than it should be. But you got unexpectedly good news this morning, so you are in a better mood than usual.",
    hint: "The shared wait is already your connection point. One wry observation about the queue is often all it takes.",
  },
  {
    id: "conference",
    category: "professional",
    tag: "Conference hallway",
    emoji: "🎤",
    context:
      "A keynote just ended at a conference in your industry. You end up next to someone at the water station in the hallway — both of you reaching for a cup at the same moment.",
    prompt: "You both laugh at the awkward reach. Break the silence.",
    tension: "The keynote was not as good as you hoped. You have opinions about it and are looking for someone worth talking to before the afternoon session.",
    hint: "Reference something specific from the keynote. Concrete details signal you were actually paying attention, not just working the room.",
  },
  {
    id: "gym",
    category: "everyday",
    tag: "Gym regular",
    emoji: "💪",
    context:
      "You have seen this person at the gym for months. You always nod to each other but have never spoken. Today you end up on adjacent machines during a quiet period — just the two of you in that section.",
    prompt: "Finally say something.",
    tension: "You have noticed this person for months and always meant to say something. Part of you is relieved they are finally speaking first.",
    hint: "Keep it brief and undemanding. A simple acknowledgment that you've seen each other around removes the strangeness without forcing a full conversation.",
  },
  {
    id: "dinner-party",
    category: "social",
    tag: "Dinner party newcomer",
    emoji: "🍽️",
    context:
      "You are new to this city and your friend invited you to their dinner party. You do not know most people there. Someone comes to refill their drink in the kitchen at the same moment as you.",
    prompt: "You both reach for the drinks at the same time. What do you say?",
    tension: "You are newer to this city too, though they do not know that yet. You have been hoping to meet someone who was not already part of the existing friend group.",
    hint: "Being new here is useful — ask how they know the host. It gives them something specific to respond to instead of a generic opener.",
  },
  {
    id: "elevator",
    category: "everyday",
    tag: "Building neighbor",
    emoji: "🏢",
    context:
      "You have lived in the same building for over a year. You always see this neighbor but only exchange nods. Tonight you step into an empty elevator together — just the two of you, eight floors to go.",
    prompt: "The doors close. Say something.",
    tension: "You have lived here over a year and kept meaning to say something. Tonight you are feeling unusually open to finally making it happen.",
    hint: "One light comment is enough — the short ride is your whole context. Don't try to cover too much ground in eight floors.",
  },
  {
    id: "mutual-friend",
    category: "social",
    tag: "Friend of a friend",
    emoji: "🤝",
    context:
      "A mutual friend just introduced you to this person at a casual hangout, then immediately got pulled away to another conversation, leaving the two of you standing there with your drinks.",
    prompt: "Your friend just walked away. Keep it going.",
    tension: "You have heard a little about this person from your mutual friend and have been mildly curious. You are open, but the other person needs to carry this now.",
    hint: "Ask how they know your mutual friend first. It gives both of you a real anchor before the conversation has to stand on its own.",
  },
  {
    id: "industry-event",
    category: "professional",
    tag: "Senior figure in your field",
    emoji: "⭐",
    context:
      "You are at an industry dinner and end up seated next to someone clearly more experienced and established in your field. They are approachable — but you can tell they have met a lot of people in their time.",
    prompt: "Dinner has just started. You go first.",
    tension: "You have met a lot of people in your field over the years. Most conversations start the same way and end unremarkably. You are genuinely hoping this one surprises you.",
    hint: "Ask what they're working on right now, not their title or background. Specific questions earn specific, interesting answers from experienced people.",
  },
];

const CHARACTER_TYPES: CharacterType[] = [
  {
    id: "introvert",
    label: "The Introvert",
    description: "Thoughtful, short answers — needs real warmth to open up",
    aiPrompt:
      "You are a reserved, introverted person. You give short, genuine answers and do not volunteer much. You are not unfriendly — just private. What draws you out: a question that feels genuinely curious, not performative. What keeps you closed: small talk that is clearly going nowhere or forced friendliness. You need real warmth before you open up.",
  },
  {
    id: "extrovert",
    label: "The Extrovert",
    description: "Warm, talkative — loves when people actually share",
    aiPrompt:
      "You are naturally warm and talkative. You respond with genuine enthusiasm, expand on topics easily, and make people feel at ease quickly. What you love: people who lean in and actually share something real. What mildly bores you: someone who stays surface-level when the conversation could clearly go somewhere. You enjoy conversation and it shows.",
  },
  {
    id: "executive",
    label: "The Busy Executive",
    description: "Direct — generic openers lose you immediately",
    aiPrompt:
      "You are a successful, busy professional. Polite but direct. You do not do small talk for long and you pay attention when someone says something genuinely interesting. What earns your engagement: something real, specific, said with confidence. What loses you immediately: vague openers, obligatory pleasantries, or anything that sounds like a script. Your responses are brief unless something earns more.",
  },
  {
    id: "guarded",
    label: "The Hard to Read",
    description: "Neutral, cautious — patience earns more than persistence",
    aiPrompt:
      "You are measured and a bit guarded. You respond politely but briefly and do not volunteer information easily. You are not rude — just not easy to draw out. What eventually opens you: patient, genuine curiosity — not persistence or obvious charm. What keeps you closed: anything that feels like a performance or a tactic. The other person has to genuinely earn your openness.",
  },
  {
    id: "traveler",
    label: "The Worldly Traveler",
    description: "Curious, full of stories — predictable questions bore them",
    aiPrompt:
      "You have traveled widely and lived in several countries. You are warm, curious, and a natural conversationalist. You often share a brief anecdote but you are equally interested in the other person's world. What delights you: unexpected angles, genuine curiosity, people who have something they actually care about. What bores you: predictable tourism questions or safe, surface-level openers.",
  },
  {
    id: "random",
    label: "Surprise me",
    description: "Random personality — the realistic challenge",
    aiPrompt:
      "Choose a personality type that feels completely realistic and natural for this scenario. Be authentic and slightly unpredictable — the person practicing should not be able to easily predict how you will respond. Make a clear decision about who you are and commit to it fully.",
  },
];

type SocialPracticeGoal = "opener" | "curiosity" | "sustain" | "natural";

const SOCIAL_GOALS: { id: SocialPracticeGoal; label: string; description: string; aiDescription: string }[] = [
  { id: "opener", label: "Breaking the ice", description: "Make the first move with confidence", aiDescription: "Breaking the ice — making a confident, natural first move" },
  { id: "curiosity", label: "Showing curiosity", description: "Ask questions that actually land", aiDescription: "Showing genuine curiosity — asking questions that make the other person lean in" },
  { id: "sustain", label: "Keeping it going", description: "Sustain natural back-and-forth", aiDescription: "Keeping the conversation going naturally — sustaining momentum without forcing it" },
  { id: "natural", label: "Sounding natural", description: "Less scripted, more genuinely at ease", aiDescription: "Sounding natural — less scripted and more genuinely at ease in the moment" },
];

function difficultyColor(d: string) {
  if (d === "easy") return "text-emerald-300";
  if (d === "hard") return "text-rose-300";
  return "text-amber-300";
}

function difficultyBadge(d: string) {
  if (d === "easy") return "border-emerald-300/20 bg-emerald-400/10 text-emerald-200";
  if (d === "hard") return "border-rose-300/20 bg-rose-400/10 text-rose-200";
  return "border-amber-300/20 bg-amber-400/10 text-amber-200";
}

function scoreLabel(s: number) {
  if (s >= 9) return "Natural connector";
  if (s >= 7) return "Confident conversationalist";
  if (s >= 5) return "Getting comfortable";
  if (s >= 3) return "Building the skill";
  return "Needs more practice";
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

export function SocialSkillsClient({ strugglingWords = [] }: { strugglingWords?: string[] } = {}) {
  const [categoryFilter, setCategoryFilter] = useState<Category>("all");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [activeCharacter, setActiveCharacter] = useState<CharacterType>(CHARACTER_TYPES[5]);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customContext, setCustomContext] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [exchangeCount, setExchangeCount] = useState(0);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [convOpen, setConvOpen] = useState(false);
  const [practiceGoal, setPracticeGoal] = useState<SocialPracticeGoal | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const threadEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const filteredScenarios =
    categoryFilter === "all" ? SCENARIOS : SCENARIOS.filter((s) => s.category === categoryFilter);

  const DIFFICULTY_MODIFIER: Record<Difficulty, string> = {
    easy: " DIFFICULTY: Easy. You are warm, patient, and actively encouraging. Smile and nod along. Ask follow-up questions readily. Give generous responses that help the conversation flow. Make it easy for the other person to feel comfortable and keep going.",
    medium: " DIFFICULTY: Medium. Behave as a realistic stranger would — neither unusually helpful nor particularly hard to engage. Respond naturally to what is said, show moderate interest, and give the conversation a realistic social dynamic with natural variation.",
    hard: " DIFFICULTY: Hard. You are guarded, reserved, and hard to impress. Give short, minimal responses unless something genuinely catches your attention. Do not volunteer information, do not ask follow-up questions unless compelled to. Make the other person work to earn your engagement. Only open up meaningfully if they say something truly thoughtful or interesting.",
  };

  function characterPromptWithDifficulty() {
    const tension = activeScenario?.tension
      ? `\n\nYour hidden context going into this: ${activeScenario.tension}`
      : "";
    return activeCharacter.aiPrompt + tension + DIFFICULTY_MODIFIER[difficulty];
  }

  function startScenario(scenario: Scenario) {
    setActiveScenario(scenario);
    setMessages([]);
    setDraft("");
    setExchangeCount(0);
    setFeedback(null);
    setError(null);
    setSaved(false);
  }

  function startCustomScenario() {
    if (!customContext.trim() || !customPrompt.trim()) return;
    startScenario({
      id: "custom",
      category: "everyday",
      tag: "Custom scenario",
      emoji: "✏️",
      context: customContext.trim(),
      prompt: customPrompt.trim(),
    });
    setShowCustomForm(false);
    setCustomContext("");
    setCustomPrompt("");
  }

  function reset() {
    setActiveScenario(null);
    setMessages([]);
    setDraft("");
    setExchangeCount(0);
    setFeedback(null);
    setError(null);
    setPracticeGoal(null);
    setShowCustomForm(false);
    setCustomContext("");
    setCustomPrompt("");
    stopRecording();
  }

  async function startRecording() {
    setError(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (SR) {
      // Prime the mic permission explicitly before starting SpeechRecognition.
      // Chrome's SR API doesn't always inherit an existing permission grant, so
      // calling getUserMedia first ensures the browser registers the grant, then
      // we release the stream and hand off to SR which manages its own stream.
      try {
        const primer = await navigator.mediaDevices.getUserMedia({ audio: true });
        primer.getTracks().forEach((t) => t.stop());
      } catch {
        setError("Could not access your microphone. Check that it is connected and allowed for this site, then try again.");
        return;
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
          setError("Speech recognition was blocked. Try opening the site in a regular Chrome tab instead of the installed app, or just type your reply.");
        } else if (e.error === "network") {
          setError("Speech recognition needs an internet connection to Google's servers. Check your connection or type your reply instead.");
        } else if (e.error === "no-speech") {
          setError("No speech detected. Try speaking louder or closer to the microphone.");
        } else {
          setError("Speech recognition failed. Try again or type your reply.");
        }
      };
      recognition.onend = () => setRecording(false);
      recognition.start();
      recognitionRef.current = recognition;
      setRecording(true);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setRecording(false);
      };
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setRecording(true);
    } catch {
      setError("Could not access microphone. Please allow microphone permission and try again.");
    }
  }

  function stopRecording() {
    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    setRecording(false);
  }

  async function sendReply() {
    if (!activeScenario || !draft.trim()) return;
    stopRecording();

    const newMessages: Message[] = [...messages, { role: "user", content: draft.trim() }];
    const newExchangeCount = exchangeCount + 1;
    setMessages(newMessages);
    setDraft("");
    setExchangeCount(newExchangeCount);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/social-conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioContext: activeScenario.context,
          characterType: activeCharacter.label,
          characterPrompt: characterPromptWithDifficulty(),
          messages: newMessages,
          exchangeCount: newExchangeCount,
          forceEnd: false,
          practiceGoal: practiceGoal ? SOCIAL_GOALS.find((g) => g.id === practiceGoal)?.aiDescription : undefined,
        }),
      });

      if (!response.ok) {
        const err = (await response.json().catch(() => ({}))) as { error?: string };
        if (response.status === 401) {
          setError("Your session has expired. Please refresh the page and log in again.");
        } else {
          setError(err.error ?? "Request failed. Try again.");
        }
        return;
      }

      const data = (await response.json()) as
        | { type: "response"; message: string }
        | { type: "feedback"; score: number; strongPoints: string[]; improvements: string[]; powerMove: string; turningPoint?: string; modelConversation?: Array<{ role: "user" | "character"; content: string }> };

      if (data.type === "response") {
        setMessages((prev) => [...prev, { role: "character", content: data.message }]);
      } else {
        setFeedback(data);
        setConvOpen(false);
      }
    } catch {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function endSession() {
    if (!activeScenario) return;
    stopRecording();

    const finalMessages: Message[] = draft.trim()
      ? [...messages, { role: "user", content: draft.trim() }]
      : messages;
    const finalCount = draft.trim() ? exchangeCount + 1 : exchangeCount;

    if (draft.trim()) setMessages(finalMessages);
    setDraft("");
    setExchangeCount(finalCount);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/social-conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioContext: activeScenario.context,
          characterType: activeCharacter.label,
          characterPrompt: characterPromptWithDifficulty(),
          messages: finalMessages,
          exchangeCount: finalCount,
          forceEnd: true,
          practiceGoal: practiceGoal ? SOCIAL_GOALS.find((g) => g.id === practiceGoal)?.aiDescription : undefined,
        }),
      });

      if (!response.ok) {
        const err = (await response.json().catch(() => ({}))) as { error?: string };
        if (response.status === 401) {
          setError("Your session has expired. Please refresh the page and log in again.");
        } else {
          setError(err.error ?? "Request failed. Try again.");
        }
        return;
      }

      const data = (await response.json()) as {
        type: "feedback";
        score: number;
        strongPoints: string[];
        improvements: string[];
        powerMove: string;
        turningPoint?: string;
        modelConversation?: Array<{ role: "user" | "character"; content: string }>;
      };

      if (data.type !== "feedback" || typeof data.score !== "number") {
        setError("Feedback couldn't be generated. Please try again.");
        return;
      }

      setFeedback(data);
      setConvOpen(false);

      // auto-save using local vars to avoid stale closure
      setSaving(true);
      fetch("/api/social-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioTag: activeScenario.tag,
          scenarioEmoji: activeScenario.emoji,
          scenarioContext: activeScenario.context,
          characterLabel: activeCharacter.label,
          difficulty,
          practiceGoal: practiceGoal ? SOCIAL_GOALS.find((g) => g.id === practiceGoal)?.label : undefined,
          exchangeCount: finalCount,
          score: data.score,
          strongPoints: data.strongPoints,
          improvements: data.improvements,
          powerMove: data.powerMove,
          messages: finalMessages,
          modelConversation: data.modelConversation ?? undefined,
        }),
      }).then((res) => { if (res.ok) setSaved(true); })
        .finally(() => setSaving(false));
    } catch {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Phase 1: Setup ──────────────────────────────────────────────────────────
  if (!activeScenario) {
    return (
      <div className="space-y-8">
        <Link
          href="/conversation-lab/history"
          className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <History className="h-4 w-4" />
          Session history
        </Link>

        {/* Struggling words bridge */}
        {strugglingWords.length > 0 ? (
          <div className="rounded-[2rem] border border-amber-300/20 bg-amber-400/8 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">From your review</p>
            <p className="mt-2 text-sm text-slate-300">
              {strugglingWords.length === 1 ? "This word is" : "These words are"} not sticking yet. Pick any scenario and try to work {strugglingWords.length === 1 ? "it" : "one of them"} naturally into the conversation.
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
          {(["all", "professional", "social", "everyday"] as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                categoryFilter === cat
                  ? "border-emerald-300/30 bg-emerald-400/15 text-emerald-200"
                  : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/8 hover:text-slate-200"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Character picker */}
        <div>
          <p className="mb-3 text-sm font-medium text-slate-300">Who are you talking to?</p>
          <div className="flex flex-wrap gap-2">
            {CHARACTER_TYPES.map((char) => (
              <button
                key={char.id}
                onClick={() => setActiveCharacter(char)}
                className={`rounded-2xl border px-4 py-2.5 text-left transition ${
                  activeCharacter.id === char.id
                    ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-200"
                    : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/8 hover:text-slate-200"
                }`}
              >
                <span className="block text-sm font-medium">{char.label}</span>
                <span className="block text-[11px] text-slate-500">{char.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <p className="mb-3 text-sm font-medium text-slate-300">Difficulty</p>
          <div className="flex gap-2">
            {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
              <button key={d} onClick={() => setDifficulty(d)}
                className={`rounded-2xl border px-4 py-2 text-sm font-medium transition ${difficulty === d ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-200" : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/8 hover:text-slate-200"}`}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {difficulty === "easy"
              ? "The person is warm and engaging — good for building confidence."
              : difficulty === "medium"
                ? "Realistic social dynamics with natural variation."
                : "A demanding partner who gives little away — make them work to open up."}
          </p>
        </div>

        {/* Practice focus */}
        <div>
          <p className="mb-3 text-sm font-medium text-slate-300">
            Practice focus <span className="text-xs font-normal text-slate-600">(optional)</span>
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {SOCIAL_GOALS.map((g) => (
              <button
                key={g.id}
                onClick={() => setPracticeGoal(practiceGoal === g.id ? null : g.id)}
                className={`rounded-2xl border px-3 py-3 text-left transition ${
                  practiceGoal === g.id
                    ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-200"
                    : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/8 hover:text-slate-200"
                }`}
              >
                <p className="text-sm font-medium">{g.label}</p>
                <p className="mt-0.5 text-xs opacity-70">{g.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Scenario grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredScenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => startScenario(scenario)}
              className="group rounded-[2rem] border border-white/10 bg-white/5 text-left transition hover:border-white/20 hover:bg-white/8 overflow-hidden"
            >
              <div className="relative h-36 w-full">
                <Image
                  src={`/scenerios/lab-${scenario.id}.webp`}
                  alt={scenario.tag}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                <span
                  className={`absolute bottom-2.5 left-3 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest ${CATEGORY_COLORS[scenario.category]}`}
                >
                  {scenario.category === "professional" ? "Professional" : scenario.category === "social" ? "Social" : "Everyday"}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{scenario.emoji}</span>
                    <p className="text-sm font-semibold text-white">{scenario.tag}</p>
                  </div>
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-600 transition group-hover:text-slate-400" />
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">{scenario.context}</p>
                <p className="mt-2 text-xs italic text-slate-500">{scenario.prompt}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Custom scenario */}
        {showCustomForm ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">✏️ Custom scenario</p>
              <button onClick={() => setShowCustomForm(false)} className="text-xs text-slate-500 hover:text-slate-300 transition">Cancel</button>
            </div>
            <div>
              <p className="mb-1.5 text-xs text-slate-400">Set the scene — where are you, who is this person?</p>
              <textarea value={customContext} onChange={(e) => setCustomContext(e.target.value)} rows={3} placeholder="You are at your cousin's birthday party and there is someone you have never met sitting next to you at the table…" className="input-base" />
            </div>
            <div>
              <p className="mb-1.5 text-xs text-slate-400">What do you need to do to start?</p>
              <textarea value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} rows={2} placeholder="The music stops briefly. Say something." className="input-base" />
            </div>
            <button onClick={startCustomScenario} disabled={!customContext.trim() || !customPrompt.trim()}
              className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed">
              Start conversation
            </button>
          </div>
        ) : (
          <button onClick={() => setShowCustomForm(true)}
            className="w-full rounded-[2rem] border border-dashed border-white/10 p-5 text-left transition hover:border-white/20">
            <p className="text-sm font-medium text-slate-300">+ Write your own scenario</p>
            <p className="mt-1 text-xs text-slate-500">Practice for a specific real situation you are navigating.</p>
          </button>
        )}
      </div>
    );
  }

  // ── Phase 3: Feedback ────────────────────────────────────────────────────────
  if (feedback) {
    return (
      <div className="space-y-5">
        <div className={`rounded-[2rem] border p-6 sm:p-8 ${scoreBorder(feedback.score)}`}>
          <div className="flex items-center gap-5">
            <div className={`text-5xl font-bold tabular-nums ${scoreColor(feedback.score)}`}>
              {feedback.score}
              <span className="text-2xl text-slate-500">/10</span>
            </div>
            <div>
              <p className={`text-lg font-semibold ${scoreColor(feedback.score)}`}>
                {scoreLabel(feedback.score)}
              </p>
              <p className="text-sm text-slate-400">
                {activeScenario.tag} · {activeCharacter.label} ·{" "}
                <span className={difficultyColor(difficulty)}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </span>{" "}
                · {exchangeCount} exchange{exchangeCount !== 1 ? "s" : ""}
                {practiceGoal ? ` · ${SOCIAL_GOALS.find((g) => g.id === practiceGoal)?.label ?? ""}` : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {feedback.strongPoints.length > 0 ? (
            <div className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">
                What worked
              </p>
              <ul className="mt-3 space-y-2">
                {feedback.strongPoints.map((point, i) => (
                  <li key={i} className="flex gap-2.5 text-sm leading-6 text-slate-200">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {feedback.improvements.length > 0 ? (
            <div className="rounded-[2rem] border border-amber-400/20 bg-amber-400/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">
                What to sharpen
              </p>
              <ul className="mt-3 space-y-2">
                {feedback.improvements.map((point, i) => (
                  <li key={i} className="flex gap-2.5 text-sm leading-6 text-slate-200">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {feedback.turningPoint ? (
          <div className="rounded-[2rem] border border-sky-300/20 bg-sky-400/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-sky-400">The turning point</p>
            <p className="mt-3 text-sm leading-7 text-slate-200">{feedback.turningPoint}</p>
          </div>
        ) : null}

        {feedback.powerMove ? (
          <div className="rounded-[2rem] border border-emerald-300/15 bg-emerald-400/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Power move to try next time
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-200">{feedback.powerMove}</p>
          </div>
        ) : null}

        {feedback.modelConversation && feedback.modelConversation.length > 0 ? (
          <div className="rounded-[2rem] border border-violet-300/20 bg-violet-400/5 p-5 space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-300">
                How it could have gone
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                A full rewrite showing one natural way this conversation could have flowed from start to finish.
              </p>
            </div>
            {feedback.modelConversation.map((msg, i) => (
              <ModelBubble key={i} msg={msg} characterLabel={activeCharacter.label} />
            ))}
          </div>
        ) : null}

        <div className="rounded-[2rem] border border-white/8 bg-white/[0.02]">
          <button
            type="button"
            onClick={() => setConvOpen((v) => !v)}
            className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-white/[0.02]"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Your conversation</p>
            <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${convOpen ? "rotate-180" : ""}`} />
          </button>
          {convOpen ? (
            <div className="border-t border-white/8 p-5 space-y-3">
              {messages.map((msg, i) => (
                <SocialBubble key={i} msg={msg} characterLabel={activeCharacter.label} />
              ))}
            </div>
          ) : null}
        </div>

        {saving ? (
          <p className="text-xs text-slate-500">Saving session…</p>
        ) : saved ? (
          <div className="flex items-center gap-3 text-xs">
            <span className="text-emerald-400">Session saved to history</span>
            <Link href="/conversation-lab/history" className="text-emerald-300 transition hover:text-emerald-200">
              View history →
            </Link>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              setFeedback(null);
              setMessages([]);
              setDraft("");
              setExchangeCount(0);
              setSaved(false);
            }}
            className="flex items-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            <RotateCcw className="h-4 w-4" />
            Try the opener again
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Pick a different scenario
          </button>
        </div>
      </div>
    );
  }

  // ── Phase 2: Conversation ────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <button
        onClick={reset}
        className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-slate-200"
      >
        <ArrowLeft className="h-4 w-4" />
        All scenarios
      </button>

      {/* Scenario context */}
      <div className="rounded-[2rem] border border-white/10 bg-white/5 overflow-hidden">
        {activeScenario.id !== "custom" && (
          <div className="relative aspect-video w-full">
            <Image
              src={`/scenerios/lab-${activeScenario.id}.webp`}
              alt={activeScenario.tag}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-4 left-5 flex flex-wrap items-center gap-2">
              <span className="text-xl">{activeScenario.emoji}</span>
              <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest ${CATEGORY_COLORS[activeScenario.category]}`}>
                {activeScenario.tag}
              </span>
            </div>
          </div>
        )}
        <div className="p-5 sm:p-6">
          {activeScenario.id === "custom" && (
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="text-xl">{activeScenario.emoji}</span>
              <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest ${CATEGORY_COLORS[activeScenario.category]}`}>
                {activeScenario.tag}
              </span>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-slate-400">
              {activeCharacter.label}
            </span>
            <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest ${difficultyBadge(difficulty)}`}>
              {difficulty}
            </span>
            {practiceGoal ? (
              <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300">
                {SOCIAL_GOALS.find((g) => g.id === practiceGoal)?.label}
              </span>
            ) : null}
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-300">{activeScenario.context}</p>
          <p className="mt-2 text-xs italic text-slate-500">{activeScenario.prompt}</p>
        </div>
      </div>

      {/* Conversation thread */}
      {messages.length > 0 ? (
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <SocialBubble key={i} msg={msg} characterLabel={activeCharacter.label} />
          ))}
          {loading ? (
            <div className="flex items-center gap-3 rounded-[2rem] border border-emerald-300/15 bg-emerald-400/5 px-5 py-4">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:300ms]" />
              </div>
              <p className="text-sm text-emerald-300/70">They are thinking…</p>
            </div>
          ) : null}
          <div ref={threadEndRef} />
        </div>
      ) : null}

      {/* Input area */}
      {!loading ? (
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
          <p className="text-sm font-medium text-slate-200">
            {exchangeCount === 0 ? "Your opening line" : "Your reply"}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {exchangeCount === 0
              ? "Say whatever you would actually say in this moment."
              : `Exchange ${exchangeCount} — keep it going naturally.`}
          </p>

          {activeScenario.hint && exchangeCount === 0 ? (
            <p className="mt-2 text-xs leading-5 text-emerald-400/75">
              <span className="font-semibold">Tip:</span> {activeScenario.hint}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {recording ? (
              <button
                type="button"
                onClick={stopRecording}
                className="flex items-center gap-2 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-400/20"
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
                Stop recording
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void startRecording()}
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <Mic className="h-4 w-4 text-emerald-300" />
                Record
              </button>
            )}
          </div>

          {error ? <p className="mt-3 text-sm text-amber-300">{error}</p> : null}

          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            placeholder={
              exchangeCount === 0
                ? "Type what you would say to open this conversation…"
                : "Type your reply…"
            }
            className="input-base mt-4"
          />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => void sendReply()}
              disabled={!draft.trim()}
              className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {exchangeCount === 0 ? "Open with this" : "Send reply"}
            </button>

            {exchangeCount >= 2 ? (
              <button
                onClick={() => void endSession()}
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <Flag className="h-4 w-4 text-slate-400" />
                {draft.trim() ? "Send & end session" : "End & get coaching"}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ModelBubble({
  msg,
  characterLabel,
}: {
  msg: { role: "user" | "character"; content: string };
  characterLabel: string;
}) {
  const isUser = msg.role === "user";
  return (
    <div
      className={`rounded-[2rem] border px-5 py-4 ${
        isUser
          ? "border-violet-300/20 bg-violet-400/8"
          : "border-white/8 bg-white/[0.03]"
      }`}
    >
      <p
        className={`mb-2 text-[10px] font-semibold uppercase tracking-widest ${
          isUser ? "text-violet-300" : "text-slate-500"
        }`}
      >
        {isUser ? "You (model)" : `Them (${characterLabel})`}
      </p>
      <p className={`text-sm leading-7 ${isUser ? "font-medium text-white" : "text-slate-300"}`}>
        {msg.content}
      </p>
    </div>
  );
}

function SocialBubble({ msg, characterLabel }: { msg: Message; characterLabel: string }) {
  const isUser = msg.role === "user";
  return (
    <div
      className={`rounded-[2rem] border px-5 py-4 ${
        isUser ? "border-white/8 bg-white/[0.03]" : "border-emerald-300/15 bg-emerald-400/5"
      }`}
    >
      <p
        className={`mb-2 text-[10px] font-semibold uppercase tracking-widest ${
          isUser ? "text-slate-500" : "text-emerald-400"
        }`}
      >
        {isUser ? "You" : `Them (${characterLabel})`}
      </p>
      <p className={`text-sm leading-7 ${isUser ? "text-slate-300" : "font-medium text-white"}`}>
        {msg.content}
      </p>
    </div>
  );
}
