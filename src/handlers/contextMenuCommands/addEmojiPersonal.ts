import { ContextMenuCommand } from "../../interfaces";
import {
	ApplicationCommandType,
	ContextMenuCommandBuilder,
	EmbedBuilder,
	GuildEmoji,
	MessageContextMenuCommandInteraction,
	PermissionFlagsBits,
} from "discord.js";
import { discordClient } from "../../main";
import db from "../../db";
import { logger } from "../../utils";

export const addEmojiPersonal: ContextMenuCommand = {
	data: new ContextMenuCommandBuilder()
		.setName("Add emoji (personal)")
		.setType(ApplicationCommandType.Message)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions)
		.setDMPermission(false),
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
			logger.error(
				`user ${interaction.user.id} failed to add emoji to personal server: user doesn't have a personal server`,
			);

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

		const guild = await discordClient.guilds.fetch(user.personal_server_id);

		if (guild.ownerId !== interaction.user.id) {
			logger.error(
				`user ${interaction.user.id} failed to add emoji to personal server ${user.personal_server_id} in guild ${interaction.guildId}: user is not the owner of the personal server`,
			);

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
			createdEmoji = await guild.emojis.create({
				name: name,
				attachment: emojiAttachment,
			});

			logger.info(
				`user ${interaction.user.id} added emoji ${createdEmoji.id} to personal guild ${guild.id}`,
			);
		} catch (error) {
			logger.error(
				`user ${interaction.user.id} failed to add emoji to personal guild ${user.personal_server_id} in guild ${interaction.guildId}: ${error}`,
			);

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
