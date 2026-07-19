import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, scopedUserId, ADMIN_USER_ID } from "@/lib/session";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId();
    if (userId !== ADMIN_USER_ID) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const uid = scopedUserId(userId);

    // Only delete if the session belongs to this user
    const session = await prisma.socialSession.findFirst({
      where: { id, userId: uid },
      select: { id: true },
    });
    if (!session) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    await prisma.socialSession.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete session." }, { status: 500 });
  }
}
