-- AlterTable
ALTER TABLE `fuel` MODIFY `type` ENUM('SuperDisel', 'Diesel', 'Octane92', 'Octane95', 'Kerosene') NOT NULL;

-- AlterTable
ALTER TABLE `trip` MODIFY `trip_status` ENUM('Pending', 'Ongoing', 'Ended', 'Completed', 'Cancelled') NOT NULL;
