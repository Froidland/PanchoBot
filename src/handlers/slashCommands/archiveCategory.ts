import {
	ChannelType,
	ChatInputCommandInteraction,
	Collection,
	EmbedBuilder,
	NonThreadGuildBasedChannel,
	OverwriteResolvable,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../interfaces";
import { logger } from "../../utils";

export const archiveCategory: SlashCommand = {
	data: new SlashCommandBuilder()
		.setName("archive-category")
		.setDescription(
			"Move text channels from source category to target category and private them by default.",
		)
		.addChannelOption((option) =>
			option
				.setName("source")
				.setDescription("Category to archive under the target category.")
				.addChannelTypes(ChannelType.GuildCategory)
				.setRequired(true),
		)
		.addChannelOption((option) =>
			option
				.setName("target")
				.setDescription("Category to archive the source text channels under.")
				.addChannelTypes(ChannelType.GuildCategory)
				.setRequired(true),
		)
		.addBooleanOption((option) =>
			option
				.setName("delete")
				.setDescription(
					"Whether the source category gets deleted or not after the process is done.",
				)
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("prefix")
				.setDescription("String to prefix each channel name with.")
				.setRequired(false),
		)
		.addRoleOption((option) =>
			option
				.setName("view-role")
				.setDescription(
					"Role with view-only permissions on the archived channels.",
				)
				.setRequired(false),
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	execute: async (interaction: ChatInputCommandInteraction) => {
		await interaction.deferReply();

		const sourceOption = interaction.options.getChannel("source", true);
		const targetOption = interaction.options.getChannel("target", true);
		const deleteOption = interaction.options.getBoolean("delete", true);

		const prefixOption = interaction.options.getString("prefix", false);
		const viewRoleOption = interaction.options.getRole("view-role", false);

		const targetChannelPermissions: OverwriteResolvable[] = [
			{
				id: interaction.guild.roles.everyone,
				deny: [PermissionFlagsBits.ViewChannel],
			},
		];

		if (viewRoleOption) {
			targetChannelPermissions.push({
				id: viewRoleOption.id,
				allow: [PermissionFlagsBits.ViewChannel],
				deny: [PermissionFlagsBits.SendMessages],
			});
		}

		if (sourceOption.id === targetOption.id) {
			logger.error(
				`user ${interaction.user.id} failed to archive category ${sourceOption.id} to ${targetOption.id} in guild ${interaction.guildId}: source and target are the same`,
			);

			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setTitle("Error")
						.setDescription(
							`\`The source category is the same as the target category.\``,
						),
				],
			});

			return;
		}

		let guildChannels: Collection<string, NonThreadGuildBasedChannel>;
		try {
			guildChannels = await interaction.guild.channels.fetch();
		} catch (error) {
			logger.error(
				`user ${interaction.user.id} failed to archive category ${sourceOption.id} to ${targetOption.id} in guild ${interaction.guildId}: ${error}`,
			);

			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setTitle("Error")
						.setDescription(
							`Failed to fetch guild channels. Please try again later.`,
						),
				],
			});

			return;
		}

		const sourceChannels = guildChannels.filter(
			(ch) =>
				ch.parentId === sourceOption.id && ch.type === ChannelType.GuildText,
		);
		const targetChannels = guildChannels.filter(
			(ch) => ch.parentId === targetOption.id,
		);

		if (sourceChannels.size < 1) {
			logger.error(
				`user ${interaction.user.id} failed to archive category ${sourceOption.id} to ${targetOption.id} in guild ${interaction.guildId}: source category has no channels`,
			);

			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setTitle("Error")
						.setDescription(
							`The source category has no text channels. Please try with a category that has text channels.`,
						),
				],
			});

			return;
		}

		if (sourceChannels.size + targetChannels.size > 50) {
			logger.error(
				`user ${interaction.user.id} failed to archive category ${sourceOption.id} to ${targetOption.id} in guild ${interaction.guildId}: target category would exceed channel limit`,
			);

			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setTitle("Error")
						.setDescription(
							"The target category has too many channels. Discord only allows 50 channels per category and this operation would exceed that limit.",
						),
				],
			});

			return;
		}

		const failedChannels: NonThreadGuildBasedChannel[] = [];

		for (const channel of sourceChannels.values()) {
			const channelName = prefixOption
				? `${prefixOption}-${channel.name}`
				: channel.name;

			try {
				await channel.edit({
					name: channelName,
					parent: targetOption.id,
					permissionOverwrites: targetChannelPermissions,
				});
			} catch (error) {
				logger.error(
					`user ${interaction.user.id} failed to archive category ${sourceOption.id} to ${targetOption.id} in guild ${interaction.guildId}: ${error}`,
				);

				failedChannels.push(channel);
			}
		}

		if (failedChannels.length > 0) {
			logger.error(
				`user ${interaction.user.id} partially archived category ${sourceOption.id} to ${targetOption.id} in guild ${interaction.guildId}: ${failedChannels.length} channels failed`,
			);

			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor("Yellow")
						.setTitle("Partial success")
						.setDescription(
							`The following channels failed to be archived: \n${failedChannels
								.map((ch) => `- <#${ch.id}>`)
								.join("\n")}`,
						),
				],
			});

			return;
		}

		if (deleteOption) {
			try {
				const sourceChannel = guildChannels.get(sourceOption.id);

				await sourceChannel.delete();
			} catch (error) {
				logger.error(
					`user ${interaction.user.id} failed to archive category ${sourceOption.id} to ${targetOption.id} in guild ${interaction.guildId}: ${error}`,
				);

				await interaction.editReply({
					embeds: [
						new EmbedBuilder()
							.setColor("Yellow")
							.setTitle("Partial success")
							.setDescription(
								`The channels were archived, but the source category could not be deleted.`,
							),
					],
				});

				return;
			}
		}

		logger.info(
			`user ${interaction.user.id} archived category ${sourceOption.id} to ${targetOption.id} in guild ${interaction.guildId}`,
		);

		await interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setColor("Green")
					.setTitle("Success")
					.setDescription(
						`The source category was archived under the target category.`,
					),
			],
		});
	},
};
