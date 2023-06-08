-- AlterTable
ALTER TABLE `Tenant` MODIFY `is_new_tenant` BIT(1) NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `Address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `postalCode` VARCHAR(9) NOT NULL,
    `street` VARCHAR(25) NOT NULL,
    `street_number` VARCHAR(5) NOT NULL,
    `district` VARCHAR(20) NOT NULL,
    `city` VARCHAR(10) NOT NULL,
    `UF` VARCHAR(2) NOT NULL,
    `tenant_id` INTEGER NULL,
    `point_id` INTEGER NULL,

    UNIQUE INDEX `Address_id_key`(`id`),
    UNIQUE INDEX `Address_tenant_id_key`(`tenant_id`),
    UNIQUE INDEX `Address_point_id_key`(`point_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `Tenant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_point_id_fkey` FOREIGN KEY (`point_id`) REFERENCES `Point`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
