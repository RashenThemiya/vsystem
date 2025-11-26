-- AlterTable
ALTER TABLE `trip` ADD COLUMN `additional_mileage_cost` DECIMAL(10, 2) NULL,
    ADD COLUMN `driver_cost` DECIMAL(10, 2) NULL,
    ADD COLUMN `fuel_cost` DECIMAL(10, 2) NULL,
    ADD COLUMN `fuel_efficiency` DECIMAL(10, 2) NULL,
    ADD COLUMN `vehicle_rent_daily` DECIMAL(10, 2) NULL;
