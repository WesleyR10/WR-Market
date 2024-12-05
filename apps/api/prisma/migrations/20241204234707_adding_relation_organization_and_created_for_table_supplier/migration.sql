/*
  Warnings:

  - Added the required column `createdById` to the `suppliers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `suppliers` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "suppliers_cnpj_key";

-- DropIndex
DROP INDEX "suppliers_email_key";

-- AlterTable
ALTER TABLE "suppliers" ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "organizationId" TEXT NOT NULL,
ALTER COLUMN "cnpj" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "suppliers_organizationId_name_idx" ON "suppliers"("organizationId", "name");

-- AddForeignKey
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
