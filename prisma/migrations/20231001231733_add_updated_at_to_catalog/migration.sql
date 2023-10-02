-- AlterTable
ALTER TABLE `Catalog` ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Tenant` MODIFY `is_new_tenant` BIT(1) NOT NULL DEFAULT true;
