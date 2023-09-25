-- AlterTable
ALTER TABLE `Tenant` MODIFY `is_new_tenant` BIT(1) NOT NULL DEFAULT true,
    MODIFY `image_name` VARCHAR(150) NULL;
