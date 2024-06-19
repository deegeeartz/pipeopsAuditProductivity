/*
  Warnings:

  - You are about to drop the column `client` on the `survey` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `survey` DROP COLUMN `client`,
    ADD COLUMN `clientName` VARCHAR(191) NULL,
    MODIFY `inspectors` JSON NULL;

-- AddForeignKey
ALTER TABLE `Survey` ADD CONSTRAINT `Survey_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
