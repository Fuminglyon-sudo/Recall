-- Deck: public share link token
ALTER TABLE "recall"."Deck" ADD COLUMN "shareToken" TEXT;
CREATE UNIQUE INDEX "Deck_shareToken_key" ON "recall"."Deck"("shareToken");
