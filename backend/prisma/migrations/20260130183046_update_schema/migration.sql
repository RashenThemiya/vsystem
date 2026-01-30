-- AlterTable
ALTER TABLE `trip` ADD COLUMN `btrip_type` ENUM('Daily', 'Special') NOT NULL DEFAULT 'Special';
