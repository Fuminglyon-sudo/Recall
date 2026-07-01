"use client";

import { useRef, useState } from "react";
import { ChevronDown, ChevronUp, Copy, Check, Sparkles } from "lucide-react";

export function PhraseItPanel({
  initialTone,
  saveToneAction,
}: {
  initialTone: string;
  saveToneAction: (formData: FormData) => void;
}) {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toneOpen, setToneOpen] = useState(!initialTone);
  const [tone, setTone] = useState(initialTone);
  const [toneSaved, setToneSaved] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handlePhrase() {
    if (!text.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/phrase-it", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json() as { result: string };
      setResult(data.result ?? "");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSaveAsCard() {
    const params = new URLSearchParams({
      front: text.trim(),
      back: result.trim(),
    });
    window.location.href = `/cards/new?${params.toString()}`;
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-300" />
            <p className="text-sm font-semibold text-white">Say it in your voice</p>
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Type what you mean. Claude phrases it the way you would.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setToneOpen((v) => !v)}
          className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400 transition hover:bg-white/10 hover:text-slate-200"
        >
          {toneOpen ? "Hide" : "My tone"}
          {toneOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Tone editor */}
      {toneOpen ? (
        <div className="border-t border-white/8 px-6 py-5">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">Your tone</p>
          <p className="mb-3 text-xs leading-5 text-slate-400">
            Describe how you sound. Sentence rhythm, words you use or avoid, the register you write in.
            Claude uses this every time you phrase something.
          </p>
          <form
            ref={formRef}
            action={(fd) => {
              saveToneAction(fd);
              setToneSaved(true);
              setTimeout(() => setToneSaved(false), 2000);
            }}
            className="space-y-3"
          >
            <textarea
              name="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              rows={4}
              placeholder={`e.g. I write in short punchy sentences. I avoid buzzwords and corporate fluff. I'm direct but warm. I care about clarity over cleverness.`}
              className="input-base"
            />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="rounded-2xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 active:scale-95"
              >
                {toneSaved ? "Saved" : "Save tone"}
              </button>
              {!tone && (
                <p className="text-xs text-slate-500">Works without a tone — Claude will still rephrase clearly.</p>
              )}
            </div>
          </form>
        </div>
      ) : null}

      {/* Phrase it */}
      <div className="border-t border-white/8 px-6 py-5 space-y-4">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">What you want to say</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Rough, vague, half-formed — just get it out. e.g. I want to explain why compounding matters in our product..."
            className="input-base"
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                void handlePhrase();
              }
            }}
          />
        </div>

        <button
          type="button"
          onClick={handlePhrase}
          disabled={loading || !text.trim()}
          className="flex items-center gap-2 rounded-2xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Sparkles className="h-4 w-4" />
          {loading ? "Phrasing…" : "Phrase it"}
        </button>

        {result ? (
          <div className="space-y-3">
            <div className="rounded-3xl border border-emerald-300/15 bg-slate-950/60 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-3">In your voice</p>
              <p className="text-sm leading-7 text-slate-100 whitespace-pre-wrap">{result}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                type="button"
                onClick={handleSaveAsCard}
                className="flex items-center gap-2 rounded-2xl border border-emerald-300/25 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-400/20"
              >
                Save as card
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
