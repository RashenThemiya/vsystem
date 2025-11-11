/*
  Warnings:

  - A unique constraint covering the columns `[nic]` on the table `Driver` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Driver_nic_key` ON `Driver`(`nic`);
