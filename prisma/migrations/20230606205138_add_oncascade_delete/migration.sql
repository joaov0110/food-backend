-- DropForeignKey
ALTER TABLE `Point` DROP FOREIGN KEY `Point_tenant_id_fkey`;

-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_productGroup_id_fkey`;

-- DropForeignKey
ALTER TABLE `ProductGroups` DROP FOREIGN KEY `ProductGroups_point_id_fkey`;

-- AlterTable
ALTER TABLE `Tenant` MODIFY `is_new_tenant` BIT(1) NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE `Point` ADD CONSTRAINT `Point_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductGroups` ADD CONSTRAINT `ProductGroups_point_id_fkey` FOREIGN KEY (`point_id`) REFERENCES `Point`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_productGroup_id_fkey` FOREIGN KEY (`productGroup_id`) REFERENCES `ProductGroups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
