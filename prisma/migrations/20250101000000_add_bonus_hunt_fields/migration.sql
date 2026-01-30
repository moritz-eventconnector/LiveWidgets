-- AlterTable
ALTER TABLE "BonusHunt" ADD COLUMN     "startBalance" DOUBLE PRECISION,
ADD COLUMN     "targetCashout" DOUBLE PRECISION,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT '€';

-- AlterTable
ALTER TABLE "BonusItem" ADD COLUMN     "provider" TEXT,
ADD COLUMN     "targetSpins" INTEGER,
ADD COLUMN     "collectedSpins" INTEGER,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'open',
ADD COLUMN     "payout" DOUBLE PRECISION;

