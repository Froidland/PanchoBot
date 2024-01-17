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

				logger.info(
					`user ${interaction.user.id} deleted channel ${channel.id} in guild ${interaction.guild.id}`,
				);
			} catch (error) {
				failedDeletionIds.push(channel.id);

				logger.error(
					`user ${interaction.user.id} failed to delete channel ${channel.id} in guild ${interaction.guild.id}: ${error}`,
				);

				continue;
			}
		}

		if (failedDeletionIds.length === categoryChildrenChannels.size) {
			logger.info(
				`user ${interaction.user.id} failed to delete category ${categoryChannel.id} in guild ${interaction.guild.id}`,
			);

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

		if (failedDeletionIds.length > 0) {
			logger.info(
				`user ${interaction.user.id} partially deleted category ${categoryChannel.id} (${categoryChildrenChannels.size - failedDeletionIds.length} channels) in guild ${interaction.guild.id}`,
			);

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
			logger.error(
				`failed to delete category ${categoryChannel.id} in guild ${interaction.guild.id}: ${error}`,
			);

			logger.info(
				`user ${interaction.user.id} partially deleted category ${categoryChannel.id} (${categoryChildrenChannels.size} channels) in guild ${interaction.guild.id}`,
			);

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

		logger.info(
			`user ${interaction.user.id} deleted category ${categoryChannel.id} (${categoryChildrenChannels.size} channels) in guild ${interaction.guild.id}`,
		);

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
