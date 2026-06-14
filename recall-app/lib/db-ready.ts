import { prisma } from "@/lib/prisma";

export async function isDatabaseReady() {
  try {
    await prisma.$queryRawUnsafe(`SELECT 1`);
    await prisma.$queryRawUnsafe(`SELECT 1 FROM "Deck" LIMIT 1`);
    return true;
  } catch {
    return false;
  }
}
