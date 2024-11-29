-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "password_hash" TEXT;

-- CreateTable
CREATE TABLE "client_tokens" (
    "id" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "client_id" TEXT NOT NULL,

    CONSTRAINT "client_tokens_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "client_tokens" ADD CONSTRAINT "client_tokens_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
