import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, scopedUserId } from "@/lib/session";

// Minimal CSV parser — handles quoted fields with embedded commas and newlines
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i += 2;
      } else if (ch === '"') {
        inQuotes = false;
        i++;
      } else {
        field += ch;
        i++;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
      } else if (ch === ",") {
        row.push(field);
        field = "";
        i++;
      } else if (ch === "\r" && text[i + 1] === "\n") {
        row.push(field);
        field = "";
        rows.push(row);
        row = [];
        i += 2;
      } else if (ch === "\n") {
        row.push(field);
        field = "";
        rows.push(row);
        row = [];
        i++;
      } else {
        field += ch;
        i++;
      }
    }
  }
  if (field || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const uid = scopedUserId(userId);

  const deck = await prisma.deck.findFirst({
    where: { id, userId: uid },
    select: { id: true },
  });
  if (!deck) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const text = await req.text();
  if (!text.trim()) {
    return NextResponse.json({ error: "Empty file." }, { status: 400 });
  }
  if (text.length > 512 * 1024) {
    return NextResponse.json({ error: "File too large (512KB max)." }, { status: 413 });
  }

  const rows = parseCSV(text.trim());
  if (rows.length < 2) {
    return NextResponse.json({ error: "File must have a header row and at least one card." }, { status: 400 });
  }

  const [headerRow, ...dataRows] = rows;
  const headers = headerRow.map((h) => h.trim().toLowerCase());
  const col = (name: string) => headers.indexOf(name);

  const frontIdx = col("front");
  const backIdx = col("back");

  if (frontIdx === -1 || backIdx === -1) {
    return NextResponse.json(
      { error: "CSV must have 'front' and 'back' columns." },
      { status: 400 }
    );
  }

  const partOfSpeechIdx = col("partofspeech");
  const exampleIdx = col("example");
  const hookIdx = col("hook");
  const synonymsIdx = col("synonyms");
  const kindIdx = col("kind");

  const MAX_ROWS = 1000;
  const clip = (s: string | undefined, n: number) => {
    const v = (s ?? "").trim();
    return v ? v.slice(0, n) : null;
  };

  const now = new Date();
  const cards = dataRows
    .slice(0, MAX_ROWS)
    .filter((r) => r[frontIdx]?.trim() && r[backIdx]?.trim())
    .map((r) => ({
      deckId: deck.id,
      front: clip(r[frontIdx], 500)!,
      back: clip(r[backIdx], 2000)!,
      partOfSpeech: partOfSpeechIdx !== -1 ? clip(r[partOfSpeechIdx], 100) : null,
      example: exampleIdx !== -1 ? clip(r[exampleIdx], 1000) : null,
      hook: hookIdx !== -1 ? clip(r[hookIdx], 1000) : null,
      synonyms: synonymsIdx !== -1 ? clip(r[synonymsIdx], 500) : null,
      kind: kindIdx !== -1 ? (clip(r[kindIdx], 50) ?? "VOCABULARY") : "VOCABULARY",
      dueAt: now,
    }));

  if (cards.length === 0) {
    return NextResponse.json({ error: "No valid cards found (front and back are required)." }, { status: 400 });
  }

  // Skip exact-duplicate fronts already in this deck
  const existingFronts = new Set(
    (await prisma.card.findMany({ where: { deckId: deck.id }, select: { front: true } })).map(
      (c) => c.front.toLowerCase()
    )
  );
  const newCards = cards.filter((c) => !existingFronts.has(c.front.toLowerCase()));

  if (newCards.length === 0) {
    return NextResponse.json({ imported: 0, skipped: cards.length, message: "All cards already exist in this deck." });
  }

  await prisma.card.createMany({ data: newCards });

  return NextResponse.json({
    imported: newCards.length,
    skipped: cards.length - newCards.length,
  });
}
