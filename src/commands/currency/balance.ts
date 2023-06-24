import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../../interfaces/command";
import db from "../../db";

export const balance: Command = {
	data: new SlashCommandBuilder()
		.setName("balance")
		.setDescription("Check your balance."),
	execute: async (interaction: CommandInteraction) => {
		await interaction.deferReply();

		const user = await db
			.selectFrom("users")
			.selectAll()
			.where("discord_id", "=", +interaction.user.id)
			.executeTakeFirst();

		if (!user) {
			await interaction.editReply(
				"You don't have an account. Please use the `/link` command to link your osu! account."
			);
			return;
		}

		await interaction.editReply(`You have ${user.money} coins.`);
	},
};
