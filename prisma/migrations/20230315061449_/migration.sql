/*
  Warnings:

  - You are about to drop the `Lobby` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Stage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tournament` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "LobbyType" ADD VALUE 'BATTLE_ROYALE';

-- AlterEnum
ALTER TYPE "TournamentType" ADD VALUE 'BATTLE_ROYALE';

-- DropForeignKey
ALTER TABLE "Lobby" DROP CONSTRAINT "Lobby_id_fkey";

-- DropForeignKey
ALTER TABLE "Stage" DROP CONSTRAINT "Stage_id_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_userDiscordId_fkey";

-- DropForeignKey
ALTER TABLE "Tournament" DROP CONSTRAINT "Tournament_id_fkey";

-- DropForeignKey
ALTER TABLE "_LobbyToTeam" DROP CONSTRAINT "_LobbyToTeam_A_fkey";

-- DropForeignKey
ALTER TABLE "_LobbyToTeam" DROP CONSTRAINT "_LobbyToTeam_B_fkey";

-- DropForeignKey
ALTER TABLE "_TeamToUser" DROP CONSTRAINT "_TeamToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_TeamToUser" DROP CONSTRAINT "_TeamToUser_B_fkey";

-- DropTable
DROP TABLE "Lobby";

-- DropTable
DROP TABLE "Stage";

-- DropTable
DROP TABLE "Team";

-- DropTable
DROP TABLE "Tournament";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "discord_id" BIGINT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("discord_id")
);

-- CreateTable
CREATE TABLE "tournaments" (
    "id" BIGSERIAL NOT NULL,
    "server_id" BIGINT NOT NULL,
    "schedules_channel_id" BIGINT NOT NULL,
    "player_role_id" BIGINT NOT NULL,
    "referee_role_id" BIGINT NOT NULL,
    "type" "TournamentType" NOT NULL,

    CONSTRAINT "tournaments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stages" (
    "id" BIGSERIAL NOT NULL,
    "type" "StageType" NOT NULL,

    CONSTRAINT "stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lobbies" (
    "id" BIGSERIAL NOT NULL,
    "named_id" TEXT NOT NULL,
    "schedule" TIMESTAMP(3) NOT NULL,
    "status" "LobbyStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "lobbies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("discord_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stages" ADD CONSTRAINT "stages_id_fkey" FOREIGN KEY ("id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lobbies" ADD CONSTRAINT "lobbies_id_fkey" FOREIGN KEY ("id") REFERENCES "stages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("discord_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LobbyToTeam" ADD CONSTRAINT "_LobbyToTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "lobbies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LobbyToTeam" ADD CONSTRAINT "_LobbyToTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamToUser" ADD CONSTRAINT "_TeamToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamToUser" ADD CONSTRAINT "_TeamToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("discord_id") ON DELETE CASCADE ON UPDATE CASCADE;
