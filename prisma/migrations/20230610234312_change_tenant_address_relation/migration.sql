/*
  Warnings:

  - Made the column `tenant_id` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `point_id` on table `Address` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Address` DROP FOREIGN KEY `Address_point_id_fkey`;

-- DropForeignKey
ALTER TABLE `Address` DROP FOREIGN KEY `Address_tenant_id_fkey`;

-- AlterTable
ALTER TABLE `Address` MODIFY `tenant_id` INTEGER NOT NULL,
    MODIFY `point_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Tenant` MODIFY `is_new_tenant` BIT(1) NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `Tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_point_id_fkey` FOREIGN KEY (`point_id`) REFERENCES `Point`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
