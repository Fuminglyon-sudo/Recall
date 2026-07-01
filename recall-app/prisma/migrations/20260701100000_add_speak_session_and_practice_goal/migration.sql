-- AddColumn: practiceGoal to SocialSession
ALTER TABLE "SocialSession" ADD COLUMN "practiceGoal" TEXT;

-- CreateTable: SpeakUpSession
CREATE TABLE "SpeakUpSession" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scenarioId" TEXT NOT NULL,
    "scenarioTag" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "personaLabel" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "practiceGoal" TEXT,
    "exchangeCount" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "strongPoints" JSONB NOT NULL,
    "improvements" JSONB NOT NULL,
    "modelAnswer" TEXT NOT NULL,
    "messages" JSONB NOT NULL,
    "userId" TEXT,
    CONSTRAINT "SpeakUpSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SpeakUpSession_userId_idx" ON "SpeakUpSession"("userId");

-- CreateIndex
CREATE INDEX "SpeakUpSession_createdAt_idx" ON "SpeakUpSession"("createdAt");

-- AddForeignKey
ALTER TABLE "SpeakUpSession" ADD CONSTRAINT "SpeakUpSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
