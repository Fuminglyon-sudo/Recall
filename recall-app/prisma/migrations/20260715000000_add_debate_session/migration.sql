-- CreateTable
CREATE TABLE "DebateSession" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motion" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "opponentType" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "exchangeCount" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "strongPoints" JSONB NOT NULL,
    "improvements" JSONB NOT NULL,
    "keyFallacy" TEXT,
    "missedArg" TEXT NOT NULL,
    "modelRebuttal" TEXT NOT NULL,
    "messages" JSONB NOT NULL,
    "userId" TEXT,

    CONSTRAINT "DebateSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DebateSession_userId_idx" ON "DebateSession"("userId");

-- CreateIndex
CREATE INDEX "DebateSession_createdAt_idx" ON "DebateSession"("createdAt");

-- AddForeignKey
ALTER TABLE "DebateSession" ADD CONSTRAINT "DebateSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
