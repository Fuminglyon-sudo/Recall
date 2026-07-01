"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, LayoutDashboard, Settings, LogOut } from "lucide-react";

export function LandingUserMenu({ userName }: { userName?: string | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const initial = userName ? userName[0].toUpperCase() : "U";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-2xl border border-white/12 bg-white/6 px-3.5 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/20 text-[11px] font-bold text-emerald-300">
          {initial}
        </span>
        <span className="hidden sm:block max-w-[120px] truncate">
          {userName ?? "My account"}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/40">
          {userName && (
            <div className="border-b border-white/8 px-4 py-3">
              <p className="truncate text-xs text-slate-500">{userName}</p>
            </div>
          )}
          <div className="py-1">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/8 hover:text-white"
            >
              <LayoutDashboard className="h-4 w-4 text-emerald-400" />
              Dashboard
            </Link>
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/8 hover:text-white"
            >
              <Settings className="h-4 w-4 text-slate-400" />
              Settings
            </Link>
          </div>
          <div className="border-t border-white/8 py-1">
            <a
              href="/api/logout"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 transition hover:bg-white/8 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
