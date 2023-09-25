-- AlterTable
ALTER TABLE `Tenant` ADD COLUMN `bgImage_name` VARCHAR(200) NULL,
    MODIFY `is_new_tenant` BIT(1) NOT NULL DEFAULT true;
