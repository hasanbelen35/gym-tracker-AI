/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `Gym` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicId]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicId]` on the table `Program` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicId]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicId]` on the table `Trainer` will be added. If there are existing duplicate values, this will fail.
  - The required column `publicId` was added to the `Gym` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `publicId` was added to the `Member` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `publicId` was added to the `Program` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `publicId` was added to the `Session` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `publicId` was added to the `Trainer` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `gym` ADD COLUMN `publicId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `member` ADD COLUMN `assignmentStatus` ENUM('UNASSIGNED', 'PENDING', 'ASSIGNED') NOT NULL DEFAULT 'UNASSIGNED',
    ADD COLUMN `publicId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `program` ADD COLUMN `publicId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `session` ADD COLUMN `publicId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `trainer` ADD COLUMN `publicId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Exercise` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NULL,
    `bodyPart` VARCHAR(191) NULL,
    `equipment` VARCHAR(191) NULL,
    `targetMuscle` VARCHAR(191) NULL,
    `instructions` TEXT NULL,
    `instruction_steps` JSON NULL,
    `gifUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Exercise_publicId_key`(`publicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Gym_publicId_key` ON `Gym`(`publicId`);

-- CreateIndex
CREATE UNIQUE INDEX `Member_publicId_key` ON `Member`(`publicId`);

-- CreateIndex
CREATE UNIQUE INDEX `Program_publicId_key` ON `Program`(`publicId`);

-- CreateIndex
CREATE UNIQUE INDEX `Session_publicId_key` ON `Session`(`publicId`);

-- CreateIndex
CREATE UNIQUE INDEX `Trainer_publicId_key` ON `Trainer`(`publicId`);
