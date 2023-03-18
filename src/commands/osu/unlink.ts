import { SlashCommandBuilder } from "discord.js";
import { v2 } from "osu-api-extended";
import { users } from "../../database/schema";
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
    //TODO: Make an embed for errors.
    await interaction.deferReply({ ephemeral: true });

    const { username } = (
      await db
        .select({ username: users.username })
        .from(users)
        .where(eq(users.discordId, +interaction.user.id))
    )[0];

    const result = await db
      .update(users)
      .set({
        userId: null,
        username: null,
      })
      .where(eq(users.discordId, +interaction.user.id));

    if (result[0].affectedRows === 0) {
      await interaction.editReply({
        content: "There is no osu! username linked to your discord account.",
      });
      return;
    }

    await interaction.editReply({
      content: `Unlinked osu! username \`${username}\` from your discord account.`,
    });
  },
};
