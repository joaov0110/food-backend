/*
  Warnings:

  - A unique constraint covering the columns `[document]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Tenant_document_key` ON `Tenant`(`document`);
