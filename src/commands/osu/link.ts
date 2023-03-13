import { SlashCommandBuilder } from "discord.js";
import { v2 } from "osu-api-extended";
import { prisma } from "../../database";
import { Command } from "../../interfaces/command";

export const link: Command = {
  data: new SlashCommandBuilder()
    .setName("link")
    .setDescription("Links your osu! profile with the specified username.")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription(
          "Username of the profile to link your discord account to."
        )
        .setRequired(true)
    ),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const username = interaction.options.get("username", true).value as string;

    const user = await v2.user.details(username, "osu");

    await prisma.user.upsert({
      where: {
        discordId: +interaction.user.id,
      },
      create: {
        discordId: +interaction.user.id,
        userId: user.id,
        username,
      },
      update: {
        userId: user.id,
        username,
      },
    });

    await interaction.editReply({
      content: `Linked your discord account to username \`${username}\`.`,
    });
  },
};
