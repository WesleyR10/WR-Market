-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TokenType" ADD VALUE 'EMAIL_VERIFY';
ALTER TYPE "TokenType" ADD VALUE 'PHONE_VERIFY';

-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "birth_date" TIMESTAMP(3);
