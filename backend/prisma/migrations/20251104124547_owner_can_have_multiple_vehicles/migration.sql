/*
  Warnings:

  - You are about to drop the column `vehicle_id` on the `owner` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `owner` DROP FOREIGN KEY `Owner_vehicle_id_fkey`;

-- DropIndex
DROP INDEX `Owner_vehicle_id_fkey` ON `owner`;

-- AlterTable
ALTER TABLE `owner` DROP COLUMN `vehicle_id`;

-- AlterTable
ALTER TABLE `vehicle` ADD COLUMN `owner_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Vehicle` ADD CONSTRAINT `Vehicle_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `Owner`(`owner_id`) ON DELETE SET NULL ON UPDATE CASCADE;
