"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Block } from "@/app/blog/data";

const GATE_AFTER = 4;

function renderBlock(block: Block, index: number) {
  if (block.type === "h2") {
    return (
      <h2
        key={index}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)",
          fontWeight: 700,
          lineHeight: 1.2,
          color: "#f1f5f9",
          marginTop: "2.5rem",
          marginBottom: "0.75rem",
        }}
      >
        {block.text}
      </h2>
    );
  }
  if (block.type === "ul") {
    return (
      <ul
        key={index}
        style={{
          margin: "1rem 0",
          paddingLeft: "1.4rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
        }}
      >
        {block.items.map((item, i) => (
          <li key={i} style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#94a3b8" }}>
            {item}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p
      key={index}
      style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "#94a3b8", margin: "1rem 0" }}
    >
      {block.text}
    </p>
  );
}

export function BlogContentGate({ blocks }: { blocks: Block[] }) {
  const visible = blocks.slice(0, GATE_AFTER);
  const hidden = blocks.slice(GATE_AFTER);
  const hasGate = hidden.length > 0;

  return (
    <>
      <div>{visible.map((b, i) => renderBlock(b, i))}</div>

      {hasGate && (
        <div style={{ position: "relative", marginTop: "1rem" }}>
          {/* Faded preview of next few blocks */}
          <div
            style={{
              maxHeight: "180px",
              overflow: "hidden",
              maskImage: "linear-gradient(to bottom, black 0%, transparent 80%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 80%)",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            {hidden.slice(0, 3).map((b, i) => renderBlock(b, GATE_AFTER + i))}
          </div>

          {/* Gate card */}
          <div
            style={{
              position: "relative",
              marginTop: "1.5rem",
              borderRadius: "1.25rem",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(15, 23, 42, 0.92)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              padding: "2.5rem 2rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {/* Emerald glow accent */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "1.25rem",
                background:
                  "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(52,211,153,0.08) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            <p
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(1.15rem, 2.5vw, 1.45rem)",
                fontWeight: 700,
                color: "#f1f5f9",
                lineHeight: 1.25,
                position: "relative",
              }}
            >
              Continue reading — free.
            </p>

            <p
              style={{
                fontSize: "0.9rem",
                color: "#94a3b8",
                lineHeight: 1.65,
                maxWidth: "28rem",
                position: "relative",
              }}
            >
              Create a free Soro Soke account to read the full article — and get access to spaced
              repetition, Speak Up, and Conversation Lab while you&apos;re at it.
            </p>

            <Link
              href="/login"
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#4ade80",
                color: "#0f172a",
                fontWeight: 700,
                fontSize: "0.9rem",
                padding: "0.75rem 1.75rem",
                borderRadius: "0.875rem",
                textDecoration: "none",
                transition: "background 0.15s",
              }}
            >
              Sign up free <ArrowRight style={{ width: "1rem", height: "1rem" }} />
            </Link>

            <p style={{ fontSize: "0.75rem", color: "#475569", position: "relative" }}>
              Already have an account?{" "}
              <Link
                href="/login"
                style={{ color: "#86efac", textDecoration: "underline", textUnderlineOffset: "3px" }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
