import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { v2 } from "osu-api-extended";
import { Command } from "../../interfaces/command";
import { db } from "../../main";

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

    try {
      await db
        .insertInto("users")
        .values({
          discord_id: +interaction.user.id,
          user_id: user.id,
          username: user.username,
        })
        .onDuplicateKeyUpdate({
          user_id: user.id,
          username: user.username,
        })
        .execute();

      await interaction.editReply({
        content: `Linked your discord account to username \`${user.username}\`.`,
      });
    } catch (error) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("Error")
            .setDescription(`\`Unable to link username in the DB.\``),
        ],
      });
    }
  },
};
