/*
  Warnings:

  - You are about to drop the column `owner_id` on the `categories` table. All the data in the column will be lost.
  - Added the required column `organization_id` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_owner_id_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "owner_id",
ADD COLUMN     "organization_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
