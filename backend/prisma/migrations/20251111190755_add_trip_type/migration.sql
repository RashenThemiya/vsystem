/*
  Warnings:

  - You are about to drop the column `location` on the `map` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `Map` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location_name` to the `Map` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Map` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sequence` to the `Map` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `map` DROP COLUMN `location`,
    ADD COLUMN `latitude` DECIMAL(10, 6) NOT NULL,
    ADD COLUMN `location_name` VARCHAR(255) NOT NULL,
    ADD COLUMN `longitude` DECIMAL(10, 6) NOT NULL,
    ADD COLUMN `sequence` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Map_trip_id_sequence_idx` ON `Map`(`trip_id`, `sequence`);
