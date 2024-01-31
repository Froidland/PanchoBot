import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	GuildEmoji,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../interfaces/index.js";
import { logger } from "../../utils/index.js";

export const addEmoji: SlashCommand = {
	data: new SlashCommandBuilder()
		.setName("add-emoji")
		.setDescription(
			"Adds the first specified emoji to the server where the command is executed.",
		)
		.addStringOption((option) =>
			option
				.setName("emoji")
				.setDescription("Emoji to steal.")
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("name")
				.setDescription("Name of the emoji.")
				.setMinLength(2)
				.setRequired(false),
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions)
		.setDMPermission(false),
	execute: async (interaction: ChatInputCommandInteraction) => {
		await interaction.deferReply();

		const emoji = interaction.options.getString("emoji");

		const emojiName = interaction.options.getString("name", false);

		// Regex for matching custom discord emoji
		// First capture group is for animated emojis (whether it has an "a" in front of it or not)
		// Second capture group is for the emoji name (2-32 characters long)
		// Third capture group is for the emoji id (17-19 characters long)
		const emojiRegex = /<?(a)?:?(\w{2,32}):(\d{17,19})>?/;
		const match = emoji.match(emojiRegex);

		if (!match) {
			logger.error({
				type: "slash-command",
				commandName: interaction.commandName,
				userId: interaction.user.id,
				guildId: interaction.guild.id,
				message: `invalid emoji provided: ${emoji}`,
			});

			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setTitle("Error")
						.setDescription("Invalid emoji."),
				],
			});

			return;
		}

		const [, animated, name, id] = match;
		const url = `https://cdn.discordapp.com/emojis/${id}.${
			animated ? "gif" : "png"
		}`;

		const emojiResponse = await fetch(url);

		if (!emojiResponse.ok) {
			logger.error({
				type: "slash-command",
				commandName: interaction.commandName,
				userId: interaction.user.id,
				guildId: interaction.guild.id,
				message: `failed to fetch emoji: ${emojiResponse.statusText}`,
			});

			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setTitle("Error")
						.setDescription("Failed to fetch emoji."),
				],
			});

			return;
		}

		const emojiAttachment = Buffer.from(await emojiResponse.arrayBuffer());
		let createdEmoji: GuildEmoji;

		try {
			createdEmoji = await interaction.guild.emojis.create({
				name: emojiName || name,
				attachment: emojiAttachment,
			});
		} catch (error) {
			logger.error({
				type: "slash-command",
				commandName: interaction.commandName,
				userId: interaction.user.id,
				guildId: interaction.guild.id,
				message: `failed to add emoji: ${error}`,
			});

			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setTitle("Error")
						.setDescription(
							"An error ocurred while trying to add the emoji. Please try again later.",
						),
				],
			});

			return;
		}

		logger.info({
			type: "slash-command",
			commandName: interaction.commandName,
			userId: interaction.user.id,
			guildId: interaction.guild.id,
			message: `added emoji ${createdEmoji.id}`,
		});

		await interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setColor("Green")
					.setTitle("Success")
					.setDescription(`Added emoji ${createdEmoji}.`),
			],
		});
	},
};
