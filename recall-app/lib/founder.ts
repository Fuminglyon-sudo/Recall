import { prisma } from "./prisma";

const DEFAULT_FOUNDER_SPOTS = 50;

/** Pure decision so the threshold logic can be unit-tested without a database. */
export function hasFounderSpotAvailable(currentFounderCount: number, founderSpotsTotal: number): boolean {
  return currentFounderCount < founderSpotsTotal;
}

/**
 * Grants the "founder" plan to a brand-new user if a spot is still open
 * (first-come, first-served against SiteConfig's founder_spots_total, same
 * source of truth the /pricing counter reads), otherwise leaves them on the
 * "free" default. Called once, from NextAuth's createUser event.
 *
 * Runs at Serializable isolation so two signups racing for the last spot
 * can't both read "49 taken" and both get granted.
 */
export async function assignFounderPlanIfAvailable(userId: string): Promise<"founder" | "free"> {
  return prisma.$transaction(
    async (tx) => {
      const [founderCount, configRow] = await Promise.all([
        tx.user.count({ where: { plan: "founder" } }),
        tx.siteConfig.findUnique({ where: { key: "founder_spots_total" } }),
      ]);
      const founderSpotsTotal = parseInt(configRow?.value ?? String(DEFAULT_FOUNDER_SPOTS), 10);

      if (!hasFounderSpotAvailable(founderCount, founderSpotsTotal)) return "free";

      await tx.user.update({
        where: { id: userId },
        data: { plan: "founder", planStartedAt: new Date() },
      });
      return "founder";
    },
    { isolationLevel: "Serializable" },
  );
}
