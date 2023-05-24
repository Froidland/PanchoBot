import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces/command";

export const template: Command = {
	data: new SlashCommandBuilder()
		.setName("Template")
		.setDescription("Template"),
	execute: async (interaction: CommandInteraction) => {},
};
