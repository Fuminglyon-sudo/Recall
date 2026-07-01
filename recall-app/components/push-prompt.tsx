"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, X } from "lucide-react";

export function PushPrompt({ vapidPublicKey }: { vapidPublicKey: string }) {
  const [status, setStatus] = useState<"idle" | "subscribed" | "denied" | "unsupported">("idle");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "granted") setStatus("subscribed");
    else if (Notification.permission === "denied") setStatus("denied");
    // Check sessionStorage so we don't re-prompt after the user dismisses this session
    if (sessionStorage.getItem("push-prompt-dismissed")) setDismissed(true);
  }, []);

  async function subscribe() {
    if (!("serviceWorker" in navigator)) return;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setStatus("denied");
      return;
    }

    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });

      setStatus("subscribed");
    } catch {
      setStatus("denied");
    }
  }

  function dismiss() {
    sessionStorage.setItem("push-prompt-dismissed", "1");
    setDismissed(true);
  }

  if (status === "unsupported" || status === "subscribed" || dismissed) return null;

  if (status === "denied") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-xs text-slate-500">
        <BellOff className="h-4 w-4 shrink-0" />
        Notifications are blocked in your browser. Enable them in browser settings to get daily reminders.
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/5 px-4 py-4">
      <Bell className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">A gentle nudge</p>
        <p className="mt-0.5 text-xs text-slate-400">
          We&apos;ll send one notification each morning when you have cards due — nothing else.
        </p>
        <button
          onClick={subscribe}
          className="mt-3 rounded-xl bg-emerald-400 px-3.5 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          Turn on reminders
        </button>
      </div>
      <button
        onClick={dismiss}
        className="mt-0.5 rounded-lg p-1 text-slate-600 transition hover:text-slate-400"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    output[i] = rawData.charCodeAt(i);
  }
  return output;
}
