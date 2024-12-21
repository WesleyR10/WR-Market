/*
  Warnings:

  - You are about to drop the column `created_by_name` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `created_by_name` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `created_by_name` on the `stocks` table. All the data in the column will be lost.
  - You are about to drop the column `created_by_name` on the `suppliers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "created_by_name";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "created_by_name";

-- AlterTable
ALTER TABLE "stocks" DROP COLUMN "created_by_name";

-- AlterTable
ALTER TABLE "suppliers" DROP COLUMN "created_by_name";
