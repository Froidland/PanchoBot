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

		const failedDeletionIds: string[] = [];

		const categoryOption = interaction.options.getChannel("category");

		const categoryChannel = await interaction.guild.channels.fetch(
			categoryOption.id,
		);

		const guildChannels = await interaction.guild.channels.fetch();

		const categoryChildrenChannels = guildChannels.filter(
			(channel) => channel.parentId === categoryChannel.id,
		);

		for (const channel of categoryChildrenChannels.values()) {
			try {
				await channel.delete();
			} catch (error) {
				failedDeletionIds.push(channel.id);

				logger.error(
					`failed to delete channel ${channel.id} in guild ${interaction.guildId}: ${error}`,
				);

				continue;
			}
		}

		if (failedDeletionIds.length === categoryChildrenChannels.size) {
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

			logger.info(
				`user ${interaction.user.id} failed to delete category ${categoryChannel.id} in guild ${interaction.guildId}`,
			);

			return;
		}

		if (failedDeletionIds.length > 0) {
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

			logger.info(
				`user ${interaction.user.id} partially deleted category ${categoryChannel.id} in guild ${interaction.guildId}`,
			);

			return;
		}

		try {
			await categoryChannel.delete();
		} catch (error) {
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

			logger.error(
				`failed to delete category ${categoryChannel.id} in guild ${interaction.guildId}: ${error}`,
			);

			logger.info(
				`user ${interaction.user.id} partially deleted category ${categoryChannel.id} in guild ${interaction.guildId}`,
			);

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

		logger.info(
			`user ${interaction.user.id} deleted category ${categoryChannel.id} in guild ${interaction.guildId}`,
		);
	},
};
