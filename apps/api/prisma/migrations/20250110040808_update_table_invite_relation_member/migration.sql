/*
  Warnings:

  - Made the column `author_id` on table `invites` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "invites" DROP CONSTRAINT "invites_author_id_fkey";

-- AlterTable
ALTER TABLE "invites" ALTER COLUMN "author_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
