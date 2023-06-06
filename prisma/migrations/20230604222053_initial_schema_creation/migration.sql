-- CreateTable
CREATE TABLE `Tenant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(25) NOT NULL,
    `document` VARCHAR(16) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `accountant_name` VARCHAR(20) NOT NULL,
    `accountant_email` VARCHAR(50) NOT NULL,
    `accountant_phone` VARCHAR(20) NOT NULL,
    `is_new_tenant` BIT(1) NOT NULL,
    `image_url` VARCHAR(200) NOT NULL,
    `bgImage_url` VARCHAR(200) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `Tenant_id_key`(`id`),
    UNIQUE INDEX `Tenant_email_key`(`email`),
    UNIQUE INDEX `Tenant_accountant_phone_key`(`accountant_phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Point` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(25) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `tenant_id` INTEGER NOT NULL,

    UNIQUE INDEX `Point_id_key`(`id`),
    UNIQUE INDEX `Point_email_key`(`email`),
    UNIQUE INDEX `Point_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductGroups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(25) NOT NULL,
    `point_id` INTEGER NOT NULL,

    UNIQUE INDEX `ProductGroups_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(25) NOT NULL,
    `image_url` VARCHAR(200) NOT NULL,
    `qnt_available` INTEGER NOT NULL,
    `availabe_for_sale` BOOLEAN NOT NULL,
    `productGroup_id` INTEGER NOT NULL,

    UNIQUE INDEX `Product_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Point` ADD CONSTRAINT `Point_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `Tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductGroups` ADD CONSTRAINT `ProductGroups_point_id_fkey` FOREIGN KEY (`point_id`) REFERENCES `Point`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_productGroup_id_fkey` FOREIGN KEY (`productGroup_id`) REFERENCES `ProductGroups`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
