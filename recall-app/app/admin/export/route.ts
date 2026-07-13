import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!(await isAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      plan: true,
      planStartedAt: true,
      _count: { select: { decks: true } },
    },
  });

  const rows = [
    ["ID", "Email", "Name", "Plan", "Joined", "Plan started", "Decks"].join(","),
    ...users.map((u) =>
      [
        u.id,
        `"${u.email}"`,
        `"${u.name ?? ""}"`,
        u.plan,
        u.createdAt.toISOString(),
        u.planStartedAt?.toISOString() ?? "",
        u._count.decks,
      ].join(",")
    ),
  ].join("\n");

  return new NextResponse(rows, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="sorosoke-users-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
