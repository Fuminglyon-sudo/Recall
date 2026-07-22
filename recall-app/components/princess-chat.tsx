"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Send } from "lucide-react";
import { PRINCESS_GREETING } from "@/lib/princess-knowledge";
import { HISTORY_WINDOW, clampMessage } from "@/lib/princess-limits";

type ChatMessage = { role: "user" | "assistant"; content: string };

const GREETING: ChatMessage = { role: "assistant", content: PRINCESS_GREETING };

// Shows the attention nudge once per browser session, not on every page
// view — sessionStorage clears when the tab/browser closes, localStorage
// wouldn't (and would nag returning visitors forever).
const NUDGE_SEEN_KEY = "princess-nudge-seen";
const NUDGE_SHOW_DELAY_MS = 1500;
const NUDGE_AUTO_HIDE_MS = 10000;

function PrincessAvatar({ size }: { size: number }) {
  return (
    <span
      className="relative flex shrink-0 overflow-hidden rounded-full ring-1 ring-white/15"
      style={{ width: size, height: size }}
    >
      <Image src="/princess_avatar.PNG" alt="Princess" fill sizes={`${size}px`} className="object-cover" />
    </span>
  );
}

// A narrow markdown subset — paragraphs, "- " bullet lists, and
// [label](url) links — parsed into React elements directly (never
// dangerouslySetInnerHTML) so there's no injection surface regardless of
// what the model outputs. Matches exactly what the system prompt is
// instructed to produce; anything else just renders as plain text.
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const linkPattern = /\[([^\]]+)\]\((\/[a-zA-Z0-9/_-]*|https:\/\/[^\s)]+)\)/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = linkPattern.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const [full, label, href] = match;
    const linkClass = "font-semibold text-emerald-300 underline decoration-emerald-400/40 underline-offset-2 transition hover:text-emerald-200";
    nodes.push(
      href.startsWith("/") ? (
        <Link key={`${keyPrefix}-a${i}`} href={href} className={linkClass}>
          {label}
        </Link>
      ) : (
        <a key={`${keyPrefix}-a${i}`} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {label}
        </a>
      )
    );
    lastIndex = match.index + full.length;
    i++;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function PrincessMessageContent({ content }: { content: string }) {
  const blocks = content.trim().split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="space-y-2">
      {blocks.map((block, bi) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        const isList = lines.length > 0 && lines.every((l) => /^[-•]\s+/.test(l));

        if (isList) {
          return (
            <ul key={bi} className="list-disc space-y-1 pl-4 marker:text-emerald-400/60">
              {lines.map((line, li) => (
                <li key={li}>{renderInline(line.replace(/^[-•]\s+/, ""), `${bi}-${li}`)}</li>
              ))}
            </ul>
          );
        }
        return <p key={bi}>{renderInline(lines.join(" "), `${bi}`)}</p>;
      })}
    </div>
  );
}

/**
 * @param liftAboveBottomNav  Set on pages that render their own fixed chrome
 *   along the bottom edge on mobile (the landing page's About/Features/Pricing
 *   pill). Raises the closed launcher clear of it so the two don't sit on top
 *   of each other on a narrow screen. The open panel doesn't need this — it is
 *   opaque and covers that chrome.
 */
export function PrincessChat({ liftAboveBottomNav = false }: { liftAboveBottomNav?: boolean } = {}) {
  const [open, setOpen] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
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

  // First-visit nudge: one short pop-up drawing the eye to the launcher,
  // shown once per session (not once ever, not on every page).
  useEffect(() => {
    if (sessionStorage.getItem(NUDGE_SEEN_KEY)) return;
    const showTimer = setTimeout(() => {
      sessionStorage.setItem(NUDGE_SEEN_KEY, "1");
      setShowNudge(true);
    }, NUDGE_SHOW_DELAY_MS);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!showNudge) return;
    const hideTimer = setTimeout(() => setShowNudge(false), NUDGE_AUTO_HIDE_MS);
    return () => clearTimeout(hideTimer);
  }, [showNudge]);

  function openChat() {
    setShowNudge(false);
    setOpen(true);
  }

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
        // Clamp on the way out so an over-long turn can never make the whole
        // conversation start failing validation.
        body: JSON.stringify({
          messages: next.slice(-HISTORY_WINDOW).map((m) => ({
            role: m.role,
            content: clampMessage(m.role, m.content),
          })),
        }),
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
      <div
        className={`fixed right-5 z-[60] flex flex-col items-end gap-3 ${
          liftAboveBottomNav ? "bottom-24 sm:bottom-5" : "bottom-5"
        }`}
      >
        {showNudge ? (
          <div className="flex max-w-[15rem] items-start gap-2.5 rounded-2xl rounded-br-sm border border-emerald-400/25 bg-slate-950/97 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <PrincessAvatar size={28} />
            <p className="flex-1 pt-0.5 text-xs leading-5 text-slate-200">
              Curious if this is right for you? Ask me anything.
            </p>
            <button
              onClick={() => setShowNudge(false)}
              aria-label="Dismiss"
              className="shrink-0 rounded-full p-0.5 text-slate-500 transition hover:text-slate-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : null}
        <button
          onClick={openChat}
          className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-slate-950/90 px-3.5 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl transition hover:border-emerald-400/50 hover:bg-slate-900"
        >
          <PrincessAvatar size={32} />
          <span className="hidden text-sm font-semibold text-white sm:inline">Ask Princess</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex h-[32rem] max-h-[80vh] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/97 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <PrincessAvatar size={36} />
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
            {m.role === "user" ? (
              <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-emerald-400 px-3.5 py-2 text-sm text-slate-950" style={{ lineHeight: 1.5 }}>
                {m.content}
              </p>
            ) : (
              <div
                className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white/8 px-3.5 py-2 text-sm text-slate-200"
                style={{ lineHeight: 1.5 }}
              >
                <PrincessMessageContent content={m.content} />
              </div>
            )}
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
