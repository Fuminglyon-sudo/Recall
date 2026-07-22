-- CreateTable
CREATE TABLE "DocReviewSession" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sampleDocId" TEXT,
    "docTitle" TEXT NOT NULL,
    "docTopic" TEXT,
    "isOwnDoc" BOOLEAN NOT NULL DEFAULT false,
    "attempted" BOOLEAN NOT NULL DEFAULT false,
    "detectionScore" INTEGER NOT NULL,
    "userNotes" TEXT NOT NULL,
    "caught" JSONB NOT NULL,
    "missed" JSONB NOT NULL,
    "topQuestions" JSONB NOT NULL,
    "judgmentNote" TEXT NOT NULL,
    "raisingTip" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "DocReviewSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DocReviewSession_userId_idx" ON "DocReviewSession"("userId");

-- CreateIndex
CREATE INDEX "DocReviewSession_createdAt_idx" ON "DocReviewSession"("createdAt");

-- AddForeignKey
ALTER TABLE "DocReviewSession" ADD CONSTRAINT "DocReviewSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
