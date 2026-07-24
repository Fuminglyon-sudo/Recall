-- CreateTable
CREATE TABLE "DocPresenterSession" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sampleDocId" TEXT,
    "docTitle" TEXT NOT NULL,
    "docTopic" TEXT,
    "isOwnDoc" BOOLEAN NOT NULL DEFAULT false,
    "summary" TEXT NOT NULL,
    "followUpQuestion" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "summaryScore" INTEGER NOT NULL,
    "answerScore" INTEGER NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "strengths" JSONB NOT NULL,
    "improvements" JSONB NOT NULL,
    "idealFollowUpAnswer" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "DocPresenterSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DocPresenterSession_userId_idx" ON "DocPresenterSession"("userId");

-- CreateIndex
CREATE INDEX "DocPresenterSession_createdAt_idx" ON "DocPresenterSession"("createdAt");

-- AddForeignKey
ALTER TABLE "DocPresenterSession" ADD CONSTRAINT "DocPresenterSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
