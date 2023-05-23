import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../interfaces/command";

export const createLobby: Command = {
	data: new SlashCommandBuilder()
		.setName("Template")
		.setDescription("Template")
		.addStringOption((option) =>
			option
				.setName("named-id")
				.setDescription('The named ID of the lobby. Example: "A12"')
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("schedule")
				.setDescription(
					'The schedule of the lobby in UTC. Format: "DD/MM/YYYY HH:MM"'
				)
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("stage")
				.setDescription("The stage of the lobby.")
				.addChoices(
					{
						name: "Group Stage",
						value: "group",
					},
					{
						name: "Round of 64",
						value: "round_64",
					},
					{
						name: "Round of 32",
						value: "round_32",
					},
					{
						name: "Round of 16",
						value: "round_16",
					},
					{
						name: "Quarterfinals",
						value: "quarterfinals",
					},
					{
						name: "Semifinals",
						value: "semifinals",
					},
					{
						name: "Finals",
						value: "finals",
					},
					{
						name: "Grand Finals",
						value: "grandfinals",
					}
				)
				.setRequired(true)
		)
		.setDMPermission(false),
	execute: async (interaction) => {},
};
