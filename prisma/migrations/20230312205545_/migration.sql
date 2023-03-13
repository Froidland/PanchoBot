-- CreateTable
CREATE TABLE `User` (
    `discord_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `username` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_discord_id_key`(`discord_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
