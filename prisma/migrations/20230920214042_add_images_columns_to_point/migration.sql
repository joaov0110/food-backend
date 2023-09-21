/*
  Warnings:

  - A unique constraint covering the columns `[image_url]` on the table `Point` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bgImage_url]` on the table `Point` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Point` ADD COLUMN `bgImage_url` VARCHAR(200) NULL,
    ADD COLUMN `image_url` VARCHAR(200) NULL;

-- AlterTable
ALTER TABLE `Tenant` MODIFY `is_new_tenant` BIT(1) NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX `Point_image_url_key` ON `Point`(`image_url`);

-- CreateIndex
CREATE UNIQUE INDEX `Point_bgImage_url_key` ON `Point`(`bgImage_url`);
