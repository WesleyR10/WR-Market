/*
  Warnings:

  - The values [SUSPENDED,PENDING] on the enum `MembershipStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MembershipStatus_new" AS ENUM ('ACTIVE', 'INACTIVE');
ALTER TABLE "members" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "members" ALTER COLUMN "status" TYPE "MembershipStatus_new" USING ("status"::text::"MembershipStatus_new");
ALTER TYPE "MembershipStatus" RENAME TO "MembershipStatus_old";
ALTER TYPE "MembershipStatus_new" RENAME TO "MembershipStatus";
DROP TYPE "MembershipStatus_old";
ALTER TABLE "members" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;
