-- AlterTable
ALTER TABLE `Tenant` ADD COLUMN `image_name` VARCHAR(30) NULL,
    MODIFY `is_new_tenant` BIT(1) NOT NULL DEFAULT true;
