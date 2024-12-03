/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `clients` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "description" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "clients_phone_key" ON "clients"("phone");

-- CreateIndex
CREATE INDEX "users_email_phone_idx" ON "users"("email", "phone");
