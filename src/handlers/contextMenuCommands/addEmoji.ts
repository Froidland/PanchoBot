import { ContextMenuCommand } from "../../interfaces";
import {
	ApplicationCommandType,
	ContextMenuCommandBuilder,
	EmbedBuilder,
	MessageContextMenuCommandInteraction,
	PermissionFlagsBits,
} from "discord.js";
import { logger } from "../../utils";

export const addEmoji: ContextMenuCommand = {
	data: new ContextMenuCommandBuilder()
		.setName("Add emoji")
		.setType(ApplicationCommandType.Message)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions)
		.setDMPermission(false),
	execute: async (interaction) => {
		await interaction.deferReply();

		interaction = interaction as MessageContextMenuCommandInteraction;

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

		try {
			const createdEmoji = await interaction.guild.emojis.create({
				name: name,
				attachment: emojiAttachment,
			});

			logger.info(
				`user ${interaction.user.id} added emoji ${createdEmoji.id} to guild ${interaction.guildId}`,
			);

			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor("Green")
						.setTitle("Success")
						.setDescription(`Added emoji ${createdEmoji}.`),
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
							"An error ocurred while trying to add the emoji. Please try again later.",
						),
				],
			});
		}
	},
};
