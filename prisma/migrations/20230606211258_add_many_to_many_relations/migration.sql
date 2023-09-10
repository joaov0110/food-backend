/*
  Warnings:

  - You are about to drop the column `point_id` on the `ProductGroups` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `ProductGroups` DROP FOREIGN KEY `ProductGroups_point_id_fkey`;

-- AlterTable
ALTER TABLE `ProductGroups` DROP COLUMN `point_id`;

-- AlterTable
ALTER TABLE `Tenant` MODIFY `is_new_tenant` BIT(1) NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `Catalog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(25) NOT NULL,

    UNIQUE INDEX `Catalog_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CatalogOnPoint` (
    `point_id` INTEGER NOT NULL,
    `catalog_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`catalog_id`, `point_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CatalogOnProductGroups` (
    `productGroup_id` INTEGER NOT NULL,
    `catalog_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`productGroup_id`, `catalog_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CatalogOnPoint` ADD CONSTRAINT `CatalogOnPoint_point_id_fkey` FOREIGN KEY (`point_id`) REFERENCES `Point`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CatalogOnPoint` ADD CONSTRAINT `CatalogOnPoint_catalog_id_fkey` FOREIGN KEY (`catalog_id`) REFERENCES `Catalog`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CatalogOnProductGroups` ADD CONSTRAINT `CatalogOnProductGroups_productGroup_id_fkey` FOREIGN KEY (`productGroup_id`) REFERENCES `ProductGroups`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CatalogOnProductGroups` ADD CONSTRAINT `CatalogOnProductGroups_catalog_id_fkey` FOREIGN KEY (`catalog_id`) REFERENCES `Catalog`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
