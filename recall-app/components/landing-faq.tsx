"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS } from "@/lib/faq-data";

export function LandingFaq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {FAQS.map((item, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-white/15"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
            aria-expanded={open === i}
          >
            <span className="text-sm font-medium text-white">{item.q}</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                open === i ? "rotate-180" : ""
              }`}
            />
          </button>
          {/* Answer always in DOM for SEO — hidden visually when collapsed */}
          <div
            className="border-t border-white/8 px-6 text-sm leading-7 text-slate-400 transition-all duration-200"
            style={open === i ? { paddingTop: "1rem", paddingBottom: "1.25rem" } : { maxHeight: 0, overflow: "hidden", paddingTop: 0, paddingBottom: 0, borderTopWidth: 0 }}
            aria-hidden={open !== i}
          >
            {item.a}
          </div>
        </div>
      ))}
    </div>
  );
}
