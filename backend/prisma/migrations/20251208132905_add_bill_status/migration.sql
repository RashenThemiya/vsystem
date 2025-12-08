/*
  Warnings:

  - Added the required column `bill_date` to the `Bill_Upload` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bill_upload` ADD COLUMN `bill_date` DATETIME(3) NOT NULL,
    ADD COLUMN `bill_status` ENUM('pending', 'completed') NOT NULL DEFAULT 'pending';
