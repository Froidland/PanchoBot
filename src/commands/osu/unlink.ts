import { SlashCommandBuilder } from "discord.js";
import { v2 } from "osu-api-extended";
import { prisma } from "../../database";
import { Command } from "../../interfaces/command";

export const unlink: Command = {
  data: new SlashCommandBuilder()
    .setName("unlink")
    .setDescription(
      "Unlinks any osu! profile associated with your discord account."
    ),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const user = await prisma.user.delete({
      where: {
        discordId: +interaction.user.id,
      },
    });

    if (user === null) {
      await interaction.editReply({
        content: "There is no osu! username linked to your discord account.",
      });
      return;
    }

    await interaction.editReply({
      content: `Unlinked osu! username \`${user.username}\` from your discord account.`,
    });
  },
};
