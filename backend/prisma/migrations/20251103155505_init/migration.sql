-- CreateTable
CREATE TABLE `Owner` (
    `owner_id` INTEGER NOT NULL AUTO_INCREMENT,
    `vehicle_id` INTEGER NOT NULL,
    `owner_name` VARCHAR(100) NOT NULL,
    `contact_number` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`owner_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vehicle` (
    `vehicle_id` INTEGER NOT NULL AUTO_INCREMENT,
    `vehicle_number` VARCHAR(50) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `type` ENUM('Car', 'Van', 'Bus', 'Bike') NOT NULL,
    `rent_cost_daily` DECIMAL(10, 2) NOT NULL,
    `fuel_id` INTEGER NOT NULL,
    `ac_type` ENUM('AC', 'Non_AC') NOT NULL,
    `owner_cost_monthly` DECIMAL(10, 2) NOT NULL,
    `license_image` LONGBLOB NULL,
    `insurance_card_image` LONGBLOB NULL,
    `eco_test_image` LONGBLOB NULL,
    `book_image` LONGBLOB NULL,
    `license_expiry_date` DATETIME(3) NULL,
    `insurance_expiry_date` DATETIME(3) NULL,
    `eco_test_expiry_date` DATETIME(3) NULL,
    `vehicle_fuel_efficiency` DECIMAL(10, 2) NULL,
    `image` LONGBLOB NULL,
    `vehicle_availability` ENUM('Yes', 'No') NOT NULL DEFAULT 'Yes',
    `meter_number` INTEGER NULL,
    `last_service_meter_number` INTEGER NULL,

    UNIQUE INDEX `Vehicle_vehicle_number_key`(`vehicle_number`),
    PRIMARY KEY (`vehicle_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mileage_Cost` (
    `mileage_cost_id` INTEGER NOT NULL AUTO_INCREMENT,
    `vehicle_id` INTEGER NOT NULL,
    `mileage_cost` DECIMAL(10, 2) NOT NULL,
    `mileage_cost_additional` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`mileage_cost_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Driver` (
    `driver_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `phone_number` VARCHAR(20) NOT NULL,
    `driver_charges` DECIMAL(10, 2) NOT NULL,
    `nic` VARCHAR(20) NOT NULL,
    `image` LONGBLOB NULL,
    `age` INTEGER NOT NULL,
    `license_number` VARCHAR(50) NOT NULL,
    `license_expiry_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`driver_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `admin_id` INTEGER NOT NULL AUTO_INCREMENT,
    `driver_id` INTEGER NULL,
    `customer_id` INTEGER NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('Admin', 'SuperAdmin', 'Driver', 'Customer') NOT NULL,

    PRIMARY KEY (`admin_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fuel` (
    `fuel_id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('Diesel', 'Octane92', 'Octane95', 'Kerosene') NOT NULL,
    `cost` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`fuel_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GPS` (
    `gps_id` INTEGER NOT NULL AUTO_INCREMENT,
    `vehicle_id` INTEGER NOT NULL,
    `tracker_id` VARCHAR(100) NOT NULL,
    `recorded_at` DATETIME(3) NOT NULL,
    `latitude` DECIMAL(10, 6) NOT NULL,
    `longitude` DECIMAL(10, 6) NOT NULL,

    PRIMARY KEY (`gps_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `customer_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nic` VARCHAR(20) NOT NULL,
    `nic_photo_front` LONGBLOB NULL,
    `nic_photo_back` LONGBLOB NULL,
    `name` VARCHAR(100) NOT NULL,
    `phone_number` VARCHAR(20) NOT NULL,
    `email` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`customer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Trip` (
    `trip_id` INTEGER NOT NULL AUTO_INCREMENT,
    `map_id` INTEGER NULL,
    `customer_id` INTEGER NOT NULL,
    `vehicle_id` INTEGER NOT NULL,
    `from_location` VARCHAR(100) NOT NULL,
    `to_location` VARCHAR(100) NOT NULL,
    `up_down` ENUM('Up', 'Down', 'Both') NOT NULL,
    `estimated_distance` DECIMAL(10, 2) NULL,
    `actual_distance` DECIMAL(10, 2) NULL,
    `estimated_days` INTEGER NULL,
    `actual_days` INTEGER NULL,
    `leaving_datetime` DATETIME(3) NOT NULL,
    `estimated_return_datetime` DATETIME(3) NULL,
    `actual_return_datetime` DATETIME(3) NULL,
    `driver_required` ENUM('Yes', 'No') NOT NULL,
    `driver_id` INTEGER NULL,
    `estimated_cost` DECIMAL(10, 2) NULL,
    `actual_cost` DECIMAL(10, 2) NULL,
    `mileage_cost` DECIMAL(10, 2) NULL,
    `fuel_required` ENUM('Yes', 'No') NOT NULL,
    `num_passengers` INTEGER NULL,
    `discount` DECIMAL(10, 2) NULL,
    `damage_cost` DECIMAL(10, 2) NULL,
    `payment_amount` DECIMAL(10, 2) NULL,
    `advance_payment` DECIMAL(10, 2) NULL,
    `start_meter` INTEGER NULL,
    `end_meter` INTEGER NULL,
    `total_estimated_cost` DECIMAL(10, 2) NULL,
    `total_actual_cost` DECIMAL(10, 2) NULL,
    `payment_status` ENUM('Paid', 'Partially_Paid', 'Unpaid') NOT NULL,
    `trip_status` ENUM('Pending', 'Ongoing', 'Ended', 'Cancelled') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`trip_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Map` (
    `map_id` INTEGER NOT NULL AUTO_INCREMENT,
    `trip_id` INTEGER NOT NULL,
    `location` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`map_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `payment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `trip_id` INTEGER NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `payment_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vehicle_Other_Cost` (
    `vehicle_other_cost_id` INTEGER NOT NULL AUTO_INCREMENT,
    `vehicle_id` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `cost` DECIMAL(10, 2) NOT NULL,
    `cost_type` ENUM('Lease_Cost', 'Service_Cost', 'Repairs_Cost', 'Insurance_Amount', 'Revenue_License', 'Eco_Test_Cost', 'Fuel_Cost') NOT NULL,

    PRIMARY KEY (`vehicle_other_cost_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bill_Upload` (
    `bill_id` INTEGER NOT NULL AUTO_INCREMENT,
    `vehicle_id` INTEGER NULL,
    `driver_id` INTEGER NULL,
    `bill_image` LONGBLOB NULL,
    `bill_type` ENUM('Lease_Cost', 'Service_Cost', 'Repairs_Cost', 'Insurance_Amount', 'Revenue_License', 'Eco_Test_Cost', 'Fuel_Cost') NOT NULL,

    PRIMARY KEY (`bill_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Other_Trip_Cost` (
    `trip_other_cost_id` INTEGER NOT NULL AUTO_INCREMENT,
    `trip_id` INTEGER NOT NULL,
    `cost_type` ENUM('Meal', 'Accommodation', 'Driver_Accommodation', 'Driver_Meal', 'Other') NOT NULL,
    `cost_amount` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`trip_other_cost_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Owner` ADD CONSTRAINT `Owner_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `Vehicle`(`vehicle_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vehicle` ADD CONSTRAINT `Vehicle_fuel_id_fkey` FOREIGN KEY (`fuel_id`) REFERENCES `Fuel`(`fuel_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mileage_Cost` ADD CONSTRAINT `Mileage_Cost_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `Vehicle`(`vehicle_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_driver_id_fkey` FOREIGN KEY (`driver_id`) REFERENCES `Driver`(`driver_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`customer_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GPS` ADD CONSTRAINT `GPS_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `Vehicle`(`vehicle_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trip` ADD CONSTRAINT `Trip_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`customer_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trip` ADD CONSTRAINT `Trip_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `Vehicle`(`vehicle_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trip` ADD CONSTRAINT `Trip_driver_id_fkey` FOREIGN KEY (`driver_id`) REFERENCES `Driver`(`driver_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Map` ADD CONSTRAINT `Map_trip_id_fkey` FOREIGN KEY (`trip_id`) REFERENCES `Trip`(`trip_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_trip_id_fkey` FOREIGN KEY (`trip_id`) REFERENCES `Trip`(`trip_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vehicle_Other_Cost` ADD CONSTRAINT `Vehicle_Other_Cost_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `Vehicle`(`vehicle_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bill_Upload` ADD CONSTRAINT `Bill_Upload_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `Vehicle`(`vehicle_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bill_Upload` ADD CONSTRAINT `Bill_Upload_driver_id_fkey` FOREIGN KEY (`driver_id`) REFERENCES `Driver`(`driver_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Other_Trip_Cost` ADD CONSTRAINT `Other_Trip_Cost_trip_id_fkey` FOREIGN KEY (`trip_id`) REFERENCES `Trip`(`trip_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
