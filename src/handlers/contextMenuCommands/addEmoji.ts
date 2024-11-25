import { ContextMenuCommand } from "../../interfaces/index.js";
import {
	ContextMenuCommandBuilder,
	EmbedBuilder,
	GuildEmoji,
	InteractionContextType,
	MessageContextMenuCommandInteraction,
	PermissionFlagsBits,
} from "discord.js";
import { logger } from "../../utils/index.js";

export const addEmoji: ContextMenuCommand = {
	data: new ContextMenuCommandBuilder()
		.setName("Add emoji")
		.setType(3) // ApplicationCommandType.Message
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions)
		.setContexts([InteractionContextType.Guild]),
	execute: async (interaction) => {
		await interaction.deferReply();

		if (!interaction.guild) {
			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setTitle("Error")
						.setDescription("This command can only be used in servers."),
				],
			});

			return;
		}

		if (!(interaction instanceof MessageContextMenuCommandInteraction)) {
			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setTitle("Error")
						.setDescription("This command can only be used on messages."),
				],
			});

			return;
		}

		const emojiRegex = /<?(a)?:?(\w{2,32}):(\d{17,19})>?/; // Example: <:pepega:123456789012345678>
		const match = interaction.targetMessage.content.match(emojiRegex);

		if (!match) {
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
				type: "context-menu-command",
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
				name: name,
				attachment: emojiAttachment,
			});
		} catch (error) {
			logger.error({
				type: "context-menu-command",
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
			type: "context-menu-command",
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
