import {
	ButtonInteraction,
	ChannelType,
	ChatInputCommandInteraction,
	ComponentType,
	EmbedBuilder,
	InteractionCollector,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../interfaces";
import { logger } from "../../utils";
import { ConfirmationComponent } from "../../components";

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
		const interactionMessage = await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor("Blue")
					.setTitle("Confirmation")
					.setDescription(
						"Are you sure you want to delete this category and all its channels?",
					),
			],
			components: [ConfirmationComponent],
		});

		let buttonInteraction: ButtonInteraction;

		try {
			buttonInteraction = await interactionMessage.awaitMessageComponent({
				componentType: ComponentType.Button,
				filter: (buttonInteraction) => {
					if (buttonInteraction.user.id !== interaction.user.id) {
						buttonInteraction.reply({
							embeds: [
								new EmbedBuilder()
									.setColor("Red")
									.setTitle("Error")
									.setDescription("You are not allowed to use this button."),
							],
							ephemeral: true,
						});

						return false;
					}

					return true;
				},
				time: 30000,
			});
		} catch (collected) {
			await interactionMessage.edit({
				embeds: [
					new EmbedBuilder()
						.setColor("Yellow")
						.setTitle("Timed out")
						.setDescription(
							"The operation timed out. Make sure you respond within 30 seconds in order to complete the operation.",
						),
				],
				components: [],
			});

			return;
		}

		buttonInteraction.update({});

		if (buttonInteraction.customId === "confirmation-cancel-button") {
			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor("Yellow")
						.setTitle("Cancelled")
						.setDescription("The operation was cancelled."),
				],
				components: [],
			});

			return;
		}

		if (buttonInteraction.customId !== "confirmation-confirm-button") {
			return;
		}

		interaction.editReply({ components: [] });

		const categoryOption = interaction.options.getChannel("category");

		// If the command was run in a channel that was deleted, don't send a reply.
		//? Sending a reply will raise an exception because it will try to send a message to a deleted channel.
		let isInteractionChannelDeleted = false;
		const failedDeletionIds: string[] = [];

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

		if (
			failedDeletionIds.length !== 0 &&
			failedDeletionIds.length === categoryChildrenChannels.size
		) {
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
