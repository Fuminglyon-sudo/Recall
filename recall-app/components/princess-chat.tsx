"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, X, Send } from "lucide-react";

type ChatMessage = { role: "user" | "assistant"; content: string };

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hi, I'm Princess. I can walk you through Speak Up, Small Talk Lab, and Debate Lab, tell you how Sọrọ Sọkẹ compares to Anki or Quizlet, explain the pricing, or tell you about Japa Reality, our sister app. What would you like to know?",
};

// Only the last few exchanges go to the API — enough for the reply to
// stay coherent without letting the request grow unbounded.
const HISTORY_WINDOW = 12;

export function PrincessChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/princess-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-HISTORY_WINDOW) }),
      });
      const data = (await res.json().catch(() => null)) as { reply?: string } | null;

      if (res.status === 429) {
        setMessages((m) => [...m, { role: "assistant", content: "I need a short breather — try again in a minute." }]);
      } else if (res.ok && data?.reply) {
        setMessages((m) => [...m, { role: "assistant", content: data.reply! }]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: "I'm having trouble replying right now — try again in a moment, or check the FAQ." }]);
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "I'm having trouble replying right now — try again in a moment, or check the FAQ." }]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-emerald-400/30 bg-slate-950/90 px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl transition hover:border-emerald-400/50 hover:bg-slate-900"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950">
          <Sparkles className="h-4 w-4" />
        </span>
        <span className="hidden text-sm font-semibold text-white sm:inline">Ask Princess</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex h-[32rem] max-h-[80vh] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/97 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-bold text-white">Princess</p>
            <p className="text-[11px] text-emerald-300">Your Sọrọ Sọkẹ guide</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          aria-label="Close chat"
          className="rounded-full p-1.5 text-slate-500 transition hover:bg-white/8 hover:text-slate-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div ref={scrollRef} role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <p
              className={
                m.role === "user"
                  ? "max-w-[85%] rounded-2xl rounded-br-sm bg-emerald-400 px-3.5 py-2 text-sm text-slate-950"
                  : "max-w-[85%] rounded-2xl rounded-bl-sm bg-white/8 px-3.5 py-2 text-sm text-slate-200"
              }
              style={{ lineHeight: 1.5 }}
            >
              {m.content}
            </p>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <p className="rounded-2xl rounded-bl-sm bg-white/8 px-3.5 py-2 text-sm text-slate-400">Princess is typing…</p>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex items-center gap-2 border-t border-white/8 p-3"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about pricing, Speak Up, Japa Reality…"
          maxLength={1000}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/40"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400 text-slate-950 transition hover:bg-emerald-300 disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
