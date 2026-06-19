import { prisma } from "@/lib/prisma";

export async function isDatabaseReady() {
  try {
    await prisma.deck.findFirst({ select: { id: true } });
    return true;
  } catch {
    return false;
  }
}
