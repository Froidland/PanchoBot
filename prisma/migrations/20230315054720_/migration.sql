-- CreateEnum
CREATE TYPE "LobbyStatus" AS ENUM ('PENDING', 'DONE');

-- CreateEnum
CREATE TYPE "LobbyType" AS ENUM ('QUALIFIERS', 'TEAM_BASED');

-- CreateEnum
CREATE TYPE "StageType" AS ENUM ('GROUP', 'QUALIFIERS', 'ROUND_64', 'ROUND_32', 'ROUND_16', 'QUARTERFINALS', 'SEMIFINALS', 'FINALS', 'GRANDFINALS');

-- CreateEnum
CREATE TYPE "TournamentType" AS ENUM ('TEAM_BASED', 'ONE_VS_ONE');

-- CreateTable
CREATE TABLE "User" (
    "discord_id" BIGINT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("discord_id")
);

-- CreateTable
CREATE TABLE "Tournament" (
    "id" BIGSERIAL NOT NULL,
    "server_id" BIGINT NOT NULL,
    "schedules_channel_id" BIGINT,
    "refereeRoleId" BIGINT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stage" (
    "id" BIGSERIAL NOT NULL,
    "type" "StageType" NOT NULL,

    CONSTRAINT "Stage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lobby" (
    "id" BIGSERIAL NOT NULL,
    "namedId" TEXT NOT NULL,
    "schedule" TIMESTAMP(3) NOT NULL,
    "status" "LobbyStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Lobby_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userDiscordId" BIGINT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LobbyToTeam" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL
);

-- CreateTable
CREATE TABLE "_TeamToUser" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LobbyToTeam_AB_unique" ON "_LobbyToTeam"("A", "B");

-- CreateIndex
CREATE INDEX "_LobbyToTeam_B_index" ON "_LobbyToTeam"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TeamToUser_AB_unique" ON "_TeamToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_TeamToUser_B_index" ON "_TeamToUser"("B");

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("discord_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stage" ADD CONSTRAINT "Stage_id_fkey" FOREIGN KEY ("id") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lobby" ADD CONSTRAINT "Lobby_id_fkey" FOREIGN KEY ("id") REFERENCES "Stage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_userDiscordId_fkey" FOREIGN KEY ("userDiscordId") REFERENCES "User"("discord_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LobbyToTeam" ADD CONSTRAINT "_LobbyToTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "Lobby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LobbyToTeam" ADD CONSTRAINT "_LobbyToTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamToUser" ADD CONSTRAINT "_TeamToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamToUser" ADD CONSTRAINT "_TeamToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("discord_id") ON DELETE CASCADE ON UPDATE CASCADE;
