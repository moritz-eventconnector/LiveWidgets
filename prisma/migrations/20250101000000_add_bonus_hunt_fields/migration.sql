-- AlterTable: Add columns to BonusHunt if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'BonusHunt' AND column_name = 'startBalance') THEN
        ALTER TABLE "BonusHunt" ADD COLUMN "startBalance" DOUBLE PRECISION;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'BonusHunt' AND column_name = 'targetCashout') THEN
        ALTER TABLE "BonusHunt" ADD COLUMN "targetCashout" DOUBLE PRECISION;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'BonusHunt' AND column_name = 'currency') THEN
        ALTER TABLE "BonusHunt" ADD COLUMN "currency" TEXT NOT NULL DEFAULT '€';
    END IF;
END $$;

-- AlterTable: Add columns to BonusItem if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'BonusItem' AND column_name = 'provider') THEN
        ALTER TABLE "BonusItem" ADD COLUMN "provider" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'BonusItem' AND column_name = 'targetSpins') THEN
        ALTER TABLE "BonusItem" ADD COLUMN "targetSpins" INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'BonusItem' AND column_name = 'collectedSpins') THEN
        ALTER TABLE "BonusItem" ADD COLUMN "collectedSpins" INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'BonusItem' AND column_name = 'status') THEN
        ALTER TABLE "BonusItem" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'open';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'BonusItem' AND column_name = 'payout') THEN
        ALTER TABLE "BonusItem" ADD COLUMN "payout" DOUBLE PRECISION;
    END IF;
END $$;

