-- AlterTable
ALTER TABLE `Point` ADD COLUMN `bgImage_name` VARCHAR(200) NULL,
    ADD COLUMN `image_name` VARCHAR(150) NULL;

-- AlterTable
ALTER TABLE `Tenant` MODIFY `is_new_tenant` BIT(1) NOT NULL DEFAULT true;
