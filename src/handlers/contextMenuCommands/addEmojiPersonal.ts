import { ContextMenuCommand } from "../../interfaces";
import {
	ApplicationCommandType,
	ContextMenuCommandBuilder,
	EmbedBuilder,
	GuildEmoji,
	MessageContextMenuCommandInteraction,
	PermissionFlagsBits,
} from "discord.js";
import db from "../../db";
import { logger } from "../../utils";

export const addEmojiPersonal: ContextMenuCommand = {
	data: new ContextMenuCommandBuilder()
		.setName("Add emoji (personal)")
		.setType(ApplicationCommandType.Message)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions),
	execute: async (interaction) => {
		await interaction.deferReply();

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

		const user = await db.user.findFirst({
			where: {
				discord_id: interaction.user.id,
			},
		});

		if (!user || !user.personal_server_id) {
			logger.error({
				type: "context-menu-command",
				commandName: interaction.commandName,
				userId: interaction.user.id,
				guildId: interaction.guild.id,
				message: `failed to add emoji to personal server: user doesn't have a personal server`,
			});

			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setTitle("Error")
						.setDescription(
							"You must set a personal server in order to use this command.",
						),
				],
			});

			return;
		}

		if (interaction.guild.id !== interaction.user.id) {
			logger.error({
				type: "context-menu-command",
				commandName: interaction.commandName,
				userId: interaction.user.id,
				guildId: interaction.guild.id,
				message: `failed to add emoji to personal server ${user.personal_server_id}: user is not the owner of the personal server`,
			});

			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setTitle("Error")
						.setDescription(
							"You must be the owner of the personal server in order to use this command.",
						),
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
				message: `failed to add emoji to personal server ${user.personal_server_id}: ${error}`,
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
			message: `added emoji ${createdEmoji.id} to personal guild ${interaction.guild.id}`,
		});

		await interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setColor("Green")
					.setTitle("Success")
					.setDescription(
						`Added emoji ${createdEmoji} to your personal server.`,
					),
			],
		});
	},
};
