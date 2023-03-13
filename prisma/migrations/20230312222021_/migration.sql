/*
  Warnings:

  - You are about to alter the column `user_id` on the `user` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `user_id` INTEGER NOT NULL;
