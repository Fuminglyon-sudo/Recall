"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStoredConsent, saveConsent, onOpenCookieSettings } from "@/lib/cookie-consent";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [analyticsChoice, setAnalyticsChoice] = useState(false);

  useEffect(() => {
    const existing = getStoredConsent();
    if (!existing) {
      setVisible(true);
    } else {
      setAnalyticsChoice(existing.analytics);
    }
    // Footer / privacy-page "Cookie settings" reopen this at any time,
    // pre-filled with whatever was last saved.
    return onOpenCookieSettings(() => {
      setAnalyticsChoice(getStoredConsent()?.analytics ?? false);
      setVisible(true);
    });
  }, []);

  if (!visible) return null;

  const acceptAll = () => {
    saveConsent(true);
    setVisible(false);
  };
  const rejectAll = () => {
    saveConsent(false);
    setVisible(false);
  };
  const savePreferences = () => {
    saveConsent(analyticsChoice);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie settings"
      aria-modal="false"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-white/10 bg-slate-950/98 px-4 py-5 backdrop-blur-xl sm:px-6"
    >
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="space-y-1.5">
          <p className="text-sm font-semibold text-white">Cookie settings</p>
          <p className="text-xs leading-5 text-slate-400">
            We use essential cookies to keep you signed in, and — only with your consent — analytics
            cookies to understand how Soro Soke is used. See our{" "}
            <Link href="/privacy" className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300">
              Privacy Policy
            </Link>{" "}
            for details.
          </p>
        </div>

        <div className="space-y-2 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-slate-300">Necessary</p>
              <p className="text-[11px] text-slate-500">Keeps you signed in. Always on.</p>
            </div>
            <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Always on
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-white/5 pt-2">
            <div>
              <p className="text-xs font-medium text-slate-300">Analytics</p>
              <p className="text-[11px] text-slate-500">Google Analytics — page views and feature usage, in aggregate.</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={analyticsChoice}
              onClick={() => setAnalyticsChoice((v) => !v)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${analyticsChoice ? "bg-emerald-400" : "bg-white/15"}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${analyticsChoice ? "translate-x-5" : "translate-x-0.5"}`}
              />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={rejectAll}
            className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/5"
          >
            Reject all
          </button>
          <button
            type="button"
            onClick={savePreferences}
            className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/5"
          >
            Save preferences
          </button>
          <button
            type="button"
            onClick={acceptAll}
            className="rounded-xl bg-emerald-400 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-emerald-300"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
