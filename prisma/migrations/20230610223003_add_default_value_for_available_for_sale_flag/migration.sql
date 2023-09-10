-- AlterTable
ALTER TABLE `Product` MODIFY `availabe_for_sale` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Tenant` MODIFY `is_new_tenant` BIT(1) NOT NULL DEFAULT true;
