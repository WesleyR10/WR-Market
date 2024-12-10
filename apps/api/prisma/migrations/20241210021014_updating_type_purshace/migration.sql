/*
  Warnings:

  - The values [RECEIVED,CANCELLED] on the enum `PurchaseStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PurchaseStatus_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
ALTER TABLE "purchases" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "purchases" ALTER COLUMN "status" TYPE "PurchaseStatus_new" USING ("status"::text::"PurchaseStatus_new");
ALTER TYPE "PurchaseStatus" RENAME TO "PurchaseStatus_old";
ALTER TYPE "PurchaseStatus_new" RENAME TO "PurchaseStatus";
DROP TYPE "PurchaseStatus_old";
ALTER TABLE "purchases" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
