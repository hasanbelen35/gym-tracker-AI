/*
  Warnings:

  - You are about to drop the column `content` on the `program` table. All the data in the column will be lost.
  - Added the required column `title` to the `Program` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `program` DROP FOREIGN KEY `Program_memberId_fkey`;

-- AlterTable
ALTER TABLE `member` ADD COLUMN `avatarUrl` VARCHAR(191) NULL,
    ADD COLUMN `gender` ENUM('MALE', 'FEMALE') NULL,
    ADD COLUMN `medicalNotes` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `program` DROP COLUMN `content`,
    ADD COLUMN `archivedAt` DATETIME(3) NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `splitType` ENUM('PPL', 'UPPER_LOWER', 'FULL_BODY', 'BRO_SPLIT', 'CUSTOM') NOT NULL DEFAULT 'PPL',
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    MODIFY `type` ENUM('WORKOUT', 'DIET') NOT NULL DEFAULT 'WORKOUT';

-- CreateTable
CREATE TABLE `WorkoutDay` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(191) NOT NULL,
    `programId` INTEGER NOT NULL,
    `dayName` VARCHAR(191) NOT NULL,
    `dayOrder` INTEGER NOT NULL,
    `isRestDay` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `WorkoutDay_publicId_key`(`publicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkoutExercise` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(191) NOT NULL,
    `dayId` INTEGER NOT NULL,
    `exerciseId` INTEGER NOT NULL,
    `orderIndex` INTEGER NOT NULL,
    `notes` TEXT NULL,

    UNIQUE INDEX `WorkoutExercise_publicId_key`(`publicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkoutSet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(191) NOT NULL,
    `workoutExerciseId` INTEGER NOT NULL,
    `setNumber` INTEGER NOT NULL,
    `targetReps` VARCHAR(191) NULL,
    `targetWeight` DOUBLE NULL,
    `rir` INTEGER NULL,

    UNIQUE INDEX `WorkoutSet_publicId_key`(`publicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Program_memberId_type_isActive_idx` ON `Program`(`memberId`, `type`, `isActive`);

-- CreateIndex
CREATE INDEX `Program_archivedAt_idx` ON `Program`(`archivedAt`);

-- AddForeignKey
ALTER TABLE `Program` ADD CONSTRAINT `Program_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkoutDay` ADD CONSTRAINT `WorkoutDay_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `Program`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkoutExercise` ADD CONSTRAINT `WorkoutExercise_dayId_fkey` FOREIGN KEY (`dayId`) REFERENCES `WorkoutDay`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkoutExercise` ADD CONSTRAINT `WorkoutExercise_exerciseId_fkey` FOREIGN KEY (`exerciseId`) REFERENCES `Exercise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkoutSet` ADD CONSTRAINT `WorkoutSet_workoutExerciseId_fkey` FOREIGN KEY (`workoutExerciseId`) REFERENCES `WorkoutExercise`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
