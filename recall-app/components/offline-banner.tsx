"use client";

import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";

export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setOffline(!navigator.onLine);
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="flex items-start gap-3 rounded-[2rem] border border-amber-400/25 bg-amber-400/8 px-5 py-4">
      <WifiOff className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
      <div>
        <p className="text-sm font-semibold text-amber-300">You&apos;re offline</p>
        <p className="mt-0.5 text-xs leading-5 text-amber-200/60">
          Your cards are showing from your last visit. Grading will resume when you reconnect — your streak is safe.
        </p>
      </div>
    </div>
  );
}
