-- Streak: longest streak tracking + recovery
ALTER TABLE "recall"."Streak" ADD COLUMN "longestStreak" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "recall"."Streak" ADD COLUMN "recoveryUsedAt" TIMESTAMP(3);

-- UserSettings: per-user daily new card limit
CREATE TABLE "recall"."UserSettings" (
    "id" TEXT NOT NULL,
    "dailyNewCards" INTEGER NOT NULL DEFAULT 3,
    "userId" TEXT NOT NULL,
    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "recall"."UserSettings"("userId");
ALTER TABLE "recall"."UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "recall"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- UserAchievement: milestone badges
CREATE TABLE "recall"."UserAchievement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "UserAchievement_userId_achievementId_key"
    ON "recall"."UserAchievement"("userId", "achievementId");
CREATE INDEX "UserAchievement_userId_idx" ON "recall"."UserAchievement"("userId");
ALTER TABLE "recall"."UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "recall"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
