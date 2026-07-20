-- CreateTable
CREATE TABLE "BannedEmail" (
    "email" TEXT NOT NULL,
    "reason" TEXT,
    "bannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BannedEmail_pkey" PRIMARY KEY ("email")
);
