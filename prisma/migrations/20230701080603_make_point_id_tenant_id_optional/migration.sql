-- DropForeignKey
ALTER TABLE `Address` DROP FOREIGN KEY `Address_point_id_fkey`;

-- DropForeignKey
ALTER TABLE `Address` DROP FOREIGN KEY `Address_tenant_id_fkey`;

-- AlterTable
ALTER TABLE `Address` MODIFY `tenant_id` INTEGER NULL,
    MODIFY `point_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `Tenant` MODIFY `is_new_tenant` BIT(1) NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `Tenant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_point_id_fkey` FOREIGN KEY (`point_id`) REFERENCES `Point`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
