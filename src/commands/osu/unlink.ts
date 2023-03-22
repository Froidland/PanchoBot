import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../interfaces/command";
import { db } from "../../main";
import { eq } from "drizzle-orm/expressions";

export const unlink: Command = {
  data: new SlashCommandBuilder()
    .setName("unlink")
    .setDescription(
      "Unlinks any osu! profile associated with your discord account."
    ),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const user = await db
      .selectFrom("users")
      .selectAll()
      .where("discord_id", "=", +interaction.user.id)
      .executeTakeFirst();

    if (user === undefined || user.user_id === null) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("Error")
            .setDescription(
              `\`There is no osu! username linked to your discord account.\``
            ),
        ],
      });

      return;
    }

    await db
      .updateTable("users")
      .set({
        user_id: null,
        username: null,
      })
      .where("discord_id", "=", +interaction.user.id)
      .execute();

    await interaction.editReply({
      content: `Unlinked osu! username \`${user.username}\` from your discord account.`,
    });
  },
};
