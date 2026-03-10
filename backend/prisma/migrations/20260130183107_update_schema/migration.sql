/*
  Warnings:

  - You are about to drop the column `btrip_type` on the `trip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `trip` DROP COLUMN `btrip_type`,
    ADD COLUMN `trip_type` ENUM('Daily', 'Special') NOT NULL DEFAULT 'Special';
