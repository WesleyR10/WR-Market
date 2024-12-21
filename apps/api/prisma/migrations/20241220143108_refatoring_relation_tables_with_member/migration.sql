/*
  Warnings:

  - You are about to drop the column `member_id` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `member_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `member_id` on the `stocks` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `suppliers` table. All the data in the column will be lost.
  - Added the required column `created_by_id` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_name` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_id` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_name` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_id` to the `stocks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_name` to the `stocks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_id` to the `suppliers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_name` to the `suppliers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_member_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_member_id_fkey";

-- DropForeignKey
ALTER TABLE "stocks" DROP CONSTRAINT "stocks_member_id_fkey";

-- DropForeignKey
ALTER TABLE "suppliers" DROP CONSTRAINT "suppliers_createdById_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "member_id",
ADD COLUMN     "created_by_id" TEXT NOT NULL,
ADD COLUMN     "created_by_name" TEXT NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "member_id",
ADD COLUMN     "created_by_id" TEXT NOT NULL,
ADD COLUMN     "created_by_name" TEXT NOT NULL,
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "stocks" DROP COLUMN "member_id",
ADD COLUMN     "created_by_id" TEXT NOT NULL,
ADD COLUMN     "created_by_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "suppliers" DROP COLUMN "createdById",
ADD COLUMN     "created_by_id" TEXT NOT NULL,
ADD COLUMN     "created_by_name" TEXT NOT NULL;
