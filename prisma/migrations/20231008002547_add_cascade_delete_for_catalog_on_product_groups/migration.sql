-- DropForeignKey
ALTER TABLE `CatalogOnProductGroups` DROP FOREIGN KEY `CatalogOnProductGroups_catalog_id_fkey`;

-- DropForeignKey
ALTER TABLE `CatalogOnProductGroups` DROP FOREIGN KEY `CatalogOnProductGroups_productGroup_id_fkey`;

-- AlterTable
ALTER TABLE `Tenant` MODIFY `is_new_tenant` BIT(1) NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE `CatalogOnProductGroups` ADD CONSTRAINT `CatalogOnProductGroups_productGroup_id_fkey` FOREIGN KEY (`productGroup_id`) REFERENCES `ProductGroups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CatalogOnProductGroups` ADD CONSTRAINT `CatalogOnProductGroups_catalog_id_fkey` FOREIGN KEY (`catalog_id`) REFERENCES `Catalog`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
