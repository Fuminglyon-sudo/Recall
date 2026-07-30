import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, scopedUserId } from "@/lib/session";

function escapeCell(value: string | null | undefined): string {
  let s = value ?? "";
  // CSV/formula injection: a cell starting with =, +, -, or @ gets evaluated
  // as a formula by Excel/Sheets/LibreOffice on open. A card front like
  // "=cmd|'/c calc'!A1" would otherwise execute on whoever opens the export.
  // A leading apostrophe is the standard neutralizer — spreadsheet apps
  // treat it as "force text" and don't render it.
  if (/^[=+\-@]/.test(s)) {
    s = `'${s}`;
  }
  // Wrap in quotes and escape inner quotes if the cell contains commas, quotes, or newlines
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(
  _req: NextRequest,
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
    include: {
      cards: {
        orderBy: { createdAt: "asc" },
        select: {
          front: true,
          back: true,
          partOfSpeech: true,
          example: true,
          hook: true,
          synonyms: true,
          kind: true,
        },
      },
    },
  });

  if (!deck) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const header = ["front", "back", "partOfSpeech", "example", "hook", "synonyms", "kind"];
  const rows = deck.cards.map((c) => [
    escapeCell(c.front),
    escapeCell(c.back),
    escapeCell(c.partOfSpeech),
    escapeCell(c.example),
    escapeCell(c.hook),
    escapeCell(c.synonyms),
    escapeCell(c.kind),
  ]);

  const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const filename = `${deck.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-cards.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
