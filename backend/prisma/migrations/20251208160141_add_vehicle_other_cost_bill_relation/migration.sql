/*
  Warnings:

  - A unique constraint covering the columns `[bill_id]` on the table `Vehicle_Other_Cost` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `vehicle_other_cost` ADD COLUMN `bill_id` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Vehicle_Other_Cost_bill_id_key` ON `Vehicle_Other_Cost`(`bill_id`);

-- AddForeignKey
ALTER TABLE `Vehicle_Other_Cost` ADD CONSTRAINT `Vehicle_Other_Cost_bill_id_fkey` FOREIGN KEY (`bill_id`) REFERENCES `Bill_Upload`(`bill_id`) ON DELETE SET NULL ON UPDATE CASCADE;
