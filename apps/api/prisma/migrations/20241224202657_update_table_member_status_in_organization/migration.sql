-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING');

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "inactivatedAt" TIMESTAMP(3),
ADD COLUMN     "inactivatedBy" TEXT,
ADD COLUMN     "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX "members_status_idx" ON "members"("status");
