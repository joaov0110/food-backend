/*
  Warnings:

  - You are about to drop the column `point_id` on the `Address` table. All the data in the column will be lost.
  - Made the column `tenant_id` on table `Address` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Address` DROP FOREIGN KEY `Address_point_id_fkey`;

-- DropForeignKey
ALTER TABLE `Address` DROP FOREIGN KEY `Address_tenant_id_fkey`;

-- AlterTable
ALTER TABLE `Address` DROP COLUMN `point_id`,
    MODIFY `tenant_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Tenant` MODIFY `is_new_tenant` BIT(1) NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `PointAddress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `postalCode` VARCHAR(9) NOT NULL,
    `street` VARCHAR(25) NOT NULL,
    `street_number` VARCHAR(5) NOT NULL,
    `district` VARCHAR(20) NOT NULL,
    `city` VARCHAR(10) NOT NULL,
    `UF` VARCHAR(2) NOT NULL,
    `point_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `PointAddress_id_key`(`id`),
    UNIQUE INDEX `PointAddress_point_id_key`(`point_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `Tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PointAddress` ADD CONSTRAINT `PointAddress_point_id_fkey` FOREIGN KEY (`point_id`) REFERENCES `Point`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
