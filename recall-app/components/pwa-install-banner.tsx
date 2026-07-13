"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { X, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Mode = "ios" | "android" | null;

const DISMISSED_KEY = "pwa-banner-v1";
const DISMISS_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function PwaInstallBanner() {
  const pathname = usePathname();
  const [mode, setMode] = useState<Mode>(null);
  const [visible, setVisible] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Full-screen slide experience — banner would overlap the dots/nav
    if (pathname === "/landing") return;

    // Already running as an installed PWA
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true
    ) return;

    // User dismissed recently
    const ts = localStorage.getItem(DISMISSED_KEY);
    if (ts && Date.now() - parseInt(ts, 10) < DISMISS_TTL_MS) return;

    const ua = navigator.userAgent;
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) &&
      !("MSStream" in window);
    // Safari only — exclude Chrome-on-iOS, Firefox-on-iOS, Edge-on-iOS
    const isSafari =
      /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS/.test(ua);

    if (isIOS && isSafari) {
      const t = setTimeout(() => {
        setMode("ios");
        setVisible(true);
      }, 3500);
      return () => clearTimeout(t);
    }

    // Android / desktop Chrome — beforeinstallprompt fires when installable
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setTimeout(() => {
        setMode("android");
        setVisible(true);
      }, 2500);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [pathname]);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, Date.now().toString());
    setVisible(false);
    setTimeout(() => setMode(null), 350);
  }

  async function install() {
    const prompt = deferredPrompt.current;
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    deferredPrompt.current = null;
    if (outcome === "accepted") {
      setVisible(false);
      setTimeout(() => setMode(null), 350);
    }
  }

  if (!mode) return null;

  return (
    <div
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        padding: "0 0.875rem",
        paddingBottom:
          "max(0.875rem, env(safe-area-inset-bottom, 0.875rem))",
        transition:
          "transform 0.38s cubic-bezier(0.22,0.61,0.36,1), opacity 0.32s ease",
        transform: visible ? "translateY(0)" : "translateY(112%)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div
        style={{
          borderRadius: "1.25rem",
          border: "1px solid rgba(52,211,153,0.22)",
          background: "rgba(9,18,36,0.97)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow:
            "0 -4px 40px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(52,211,153,0.04)",
          padding: "0.875rem 0.875rem 0.875rem 1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        {/* App icon */}
        <div
          aria-hidden="true"
          style={{
            width: 46,
            height: 46,
            borderRadius: "0.9rem",
            background: "#0f172a",
            border: "1px solid rgba(52,211,153,0.28)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontStyle: "italic",
            fontWeight: 800,
            fontSize: "1.1rem",
            color: "#34d399",
            letterSpacing: "-0.05em",
          }}
        >
          SS
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "#f1f5f9",
              lineHeight: 1.3,
            }}
          >
            Add to your home screen
          </p>

          {mode === "ios" ? (
            <p
              style={{
                margin: "0.22rem 0 0",
                fontSize: "0.72rem",
                color: "#94a3b8",
                lineHeight: 1.5,
              }}
            >
              Tap{" "}
              <Share
                aria-label="Share"
                style={{
                  display: "inline",
                  verticalAlign: "middle",
                  width: 12,
                  height: 12,
                  color: "#60a5fa",
                }}
              />{" "}
              then{" "}
              <strong style={{ color: "#e2e8f0", fontWeight: 600 }}>
                Add to Home Screen
              </strong>
            </p>
          ) : (
            <p
              style={{
                margin: "0.22rem 0 0",
                fontSize: "0.72rem",
                color: "#94a3b8",
                lineHeight: 1.5,
              }}
            >
              Install for faster access &amp; offline use
            </p>
          )}
        </div>

        {/* Android install button */}
        {mode === "android" && (
          <button
            onClick={install}
            style={{
              flexShrink: 0,
              borderRadius: "0.65rem",
              background: "#34d399",
              color: "#0f172a",
              border: "none",
              padding: "0.5rem 0.95rem",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            Install
          </button>
        )}

        {/* Dismiss */}
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          style={{
            flexShrink: 0,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(148,163,184,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <X style={{ width: 13, height: 13 }} />
        </button>
      </div>
    </div>
  );
}
