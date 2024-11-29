-- CreateEnum
CREATE TYPE "SaleSource" AS ENUM ('ADMIN', 'ECOMMERCE');

-- DropForeignKey
ALTER TABLE "sales" DROP CONSTRAINT "sales_created_by_id_fkey";

-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "sales" ADD COLUMN     "source" "SaleSource" NOT NULL DEFAULT 'ADMIN',
ALTER COLUMN "created_by_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
