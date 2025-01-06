/*
  Warnings:

  - You are about to drop the column `image_url` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sku]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[barcode]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "image_url",
ADD COLUMN     "barcode" TEXT,
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "cost_price" DECIMAL(65,30),
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "max_stock" INTEGER,
ADD COLUMN     "min_stock" INTEGER,
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "unit" TEXT,
ADD COLUMN     "weight" DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "products_barcode_key" ON "products"("barcode");
