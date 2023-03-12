import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces/command";

export const ping: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Sends a Pong! message."),
  execute: async (interaction: CommandInteraction) => {
    await interaction.reply({ content: "Pong!", ephemeral: true });
  },
};
