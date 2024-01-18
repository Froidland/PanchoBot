import {
	ChannelType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../interfaces";
import { logger } from "../../utils";

export const deleteCategory: SlashCommand = {
	data: new SlashCommandBuilder()
		.setName("delete-category")
		.setDescription("Delete a category and all its channels.")
		.addChannelOption((option) =>
			option
				.setName("category")
				.setDescription("Category to delete.")
				.addChannelTypes(ChannelType.GuildCategory)
				.setRequired(true),
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	execute: async (interaction: ChatInputCommandInteraction) => {
		await interaction.deferReply();

		// If the command was run in a channel that was deleted, don't send a reply.
		//? Sending a reply will raise an exception because it will try to send a message to a deleted channel.
		let isInteractionChannelDeleted = false;
		const failedDeletionIds: string[] = [];

		const categoryOption = interaction.options.getChannel("category");

		const guildChannels = await interaction.guild.channels.fetch();

		const categoryChannel = guildChannels.get(categoryOption.id);

		const categoryChildrenChannels = guildChannels.filter(
			(channel) => channel.parentId === categoryChannel.id,
		);

		for (const channel of categoryChildrenChannels.values()) {
			try {
				const deletedChannel = await channel.delete();

				if (deletedChannel.id === interaction.channelId) {
					isInteractionChannelDeleted = true;
				}

				logger.info({
					type: "slash-command",
					commandName: interaction.commandName,
					userId: interaction.user.id,
					guildId: interaction.guild.id,
					message: `deleted channel ${channel.id}`,
				});
			} catch (error) {
				failedDeletionIds.push(channel.id);

				logger.error({
					type: "slash-command",
					commandName: interaction.commandName,
					userId: interaction.user.id,
					guildId: interaction.guild.id,
					message: `failed to delete channel ${channel.id}: ${error}`,
				});

				continue;
			}
		}

		if (failedDeletionIds.length === categoryChildrenChannels.size) {
			logger.info({
				type: "slash-command",
				commandName: interaction.commandName,
				userId: interaction.user.id,
				guildId: interaction.guild.id,
				message: `failed to delete category ${categoryChannel.id}`,
			});

			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setTitle("Error")
						.setDescription(
							"Unable to delete the channels specified. Please make sure the bot has the correct permissions and try again.",
						),
				],
			});

			return;
		}

		if (failedDeletionIds.length > 0 && !isInteractionChannelDeleted) {
			logger.info({
				type: "slash-command",
				commandName: interaction.commandName,
				userId: interaction.user.id,
				guildId: interaction.guild.id,
				message: `partially deleted category ${categoryChannel.id} (${categoryChildrenChannels.size - failedDeletionIds.length} channels)`,
			});

			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor("Yellow")
						.setTitle("Partial success")
						.setDescription(
							"The following channels could not be deleted: \n" +
								failedDeletionIds.map((id) => `- <#${id}>`).join("\n"),
						),
				],
			});

			return;
		}

		try {
			await categoryChannel.delete();
		} catch (error) {
			logger.error({
				type: "slash-command",
				commandName: interaction.commandName,
				userId: interaction.user.id,
				guildId: interaction.guild.id,
				message: `failed to delete category ${categoryChannel.id}: ${error}`,
			});

			logger.info({
				type: "slash-command",
				commandName: interaction.commandName,
				userId: interaction.user.id,
				guildId: interaction.guild.id,
				message: `partially deleted category ${categoryChannel.id} (${categoryChildrenChannels.size} channels)`,
			});

			if (isInteractionChannelDeleted) {
				return;
			}

			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor("Yellow")
						.setTitle("Partial success")
						.setDescription(
							"The channels were deleted, but the category could not be deleted.",
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
			message: `deleted category ${categoryChannel.id} (${categoryChildrenChannels.size} channels)`,
		});

		if (isInteractionChannelDeleted) {
			return;
		}

		await interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setColor("Green")
					.setTitle("Success")
					.setDescription("The category and all its channels were deleted."),
			],
		});
	},
};
