"use client";

import { useRef, useState } from "react";
import { Download, Upload, CheckCircle2, AlertCircle } from "lucide-react";

export function DeckIO({ deckId }: { deckId: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportResult(null);

    try {
      const text = await file.text();
      const res = await fetch(`/api/decks/${deckId}/import`, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: text,
      });
      const data = (await res.json()) as {
        imported?: number;
        skipped?: number;
        message?: string;
        error?: string;
      };
      if (!res.ok) {
        setImportResult({ ok: false, message: data.error ?? "Import failed." });
      } else {
        const { imported = 0, skipped = 0 } = data;
        setImportResult({
          ok: true,
          message:
            imported === 0
              ? data.message ?? "Nothing new to import."
              : `${imported} card${imported === 1 ? "" : "s"} imported${skipped > 0 ? `, ${skipped} skipped (already exist)` : ""}.`,
        });
      }
    } catch {
      setImportResult({ ok: false, message: "Unexpected error — check the file format." });
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Export */}
      <a
        href={`/api/decks/${deckId}/export`}
        download
        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
      >
        <Download className="h-3.5 w-3.5" />
        Export CSV
      </a>

      {/* Import */}
      <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white">
        <Upload className="h-3.5 w-3.5" />
        {importing ? "Importing…" : "Import CSV"}
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          className="sr-only"
          onChange={handleImport}
          disabled={importing}
        />
      </label>

      {importResult ? (
        <span
          className={`flex items-center gap-1.5 text-xs ${
            importResult.ok ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {importResult.ok ? (
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          )}
          {importResult.message}
        </span>
      ) : null}

      <p className="text-xs text-slate-600">
        CSV columns: <span className="font-mono">front, back</span> (required) +{" "}
        <span className="font-mono">partOfSpeech, example, hook, synonyms, kind</span> (optional)
      </p>
    </div>
  );
}
