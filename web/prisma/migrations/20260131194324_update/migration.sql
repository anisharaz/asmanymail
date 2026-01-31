/*
  Warnings:

  - You are about to drop the column `attachments` on the `Emails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Emails" DROP COLUMN "attachments";

-- CreateTable
CREATE TABLE "Attachments" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "size" BIGINT NOT NULL,
    "url" TEXT NOT NULL,
    "emailId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attachments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Attachments" ADD CONSTRAINT "Attachments_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "Emails"("id") ON DELETE CASCADE ON UPDATE CASCADE;
