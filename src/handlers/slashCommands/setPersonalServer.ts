import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../interfaces";
import db from "../../db";
import { logger } from "../../utils";

export const setPersonalServer: SlashCommand = {
	data: new SlashCommandBuilder()
		.setName("set-personal-server")
		.setDescription("Set the current server as your personal server.")
		.setDMPermission(false),
	execute: async (interaction) => {
		await interaction.deferReply();

		const userId = interaction.user.id;

		//? Will never happen becuase the command doesn't exist on DMs.
		if (!interaction.guildId) {
			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setTitle("Error")
						.setDescription("This command can only be used in a server."),
				],
			});

			return;
		}

		if (interaction.guild.ownerId !== userId) {
			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setTitle("Error")
						.setDescription(
							"You must be the owner of the server in order to set it as your personal server.",
						),
				],
			});

			return;
		}

		try {
			await db.user.upsert({
				where: {
					discord_id: interaction.user.id,
				},
				create: {
					discord_id: interaction.user.id,
					personal_server_id: interaction.guildId,
				},
				update: {
					personal_server_id: interaction.guildId,
				},
			});

			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor("Green")
						.setTitle("Success")
						.setDescription(
							"The current server has been set as your personal server.",
						),
				],
			});
		} catch (error) {
			logger.error(error);

			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setTitle("Error")
						.setDescription(
							"An error ocurred while trying to set your personal server. Please try again later.",
						),
				],
			});
		}
	},
};
