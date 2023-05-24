import {
	ChannelType,
	CommandInteraction,
	EmbedBuilder,
	OverwriteResolvable,
	PermissionFlagsBits,
	SlashCommandBuilder,
	TextChannel,
} from "discord.js";
import { Command } from "../../interfaces/command";

export const archiveCategory: Command = {
	data: new SlashCommandBuilder()
		.setName("archive-category")
		.setDescription(
			"Move text channels from source category to target category and private them by default."
		)
		.addChannelOption((option) =>
			option
				.setName("source")
				.setDescription("Category to archive under the target category.")
				.addChannelTypes(ChannelType.GuildCategory)
				.setRequired(true)
		)
		.addChannelOption((option) =>
			option
				.setName("target")
				.setDescription("Category to archive the source text channels under.")
				.addChannelTypes(ChannelType.GuildCategory)
				.setRequired(true)
		)
		.addBooleanOption((option) =>
			option
				.setName("delete")
				.setDescription(
					"Whether the source category gets deleted or not after the process is done."
				)
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("prefix")
				.setDescription("String to prefix each channel name with.")
				.setRequired(false)
		)
		.addRoleOption((option) =>
			option
				.setName("view-role")
				.setDescription(
					"Role with view-only permissions on the archived channels."
				)
				.setRequired(false)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	execute: async (interaction: CommandInteraction) => {
		await interaction.deferReply();
		const sourceOption = interaction.options.get("source");
		const targetOption = interaction.options.get("target");
		const deleteSourceOption = interaction.options.get("delete");

		const prefixOption = interaction.options.get("prefix", false);
		const viewRoleOption = interaction.options.get("view-role", false);

		let targetChannelPermissions: OverwriteResolvable[] = [
			{
				id: interaction.guild.roles.everyone,
				deny: [PermissionFlagsBits.ViewChannel],
			},
		];

		if (viewRoleOption !== null) {
			targetChannelPermissions.push({
				id: viewRoleOption.role.id,
				allow: [PermissionFlagsBits.ViewChannel],
				deny: [PermissionFlagsBits.SendMessages],
			});
		}

		const sourceCategory = await interaction.guild.channels.fetch(
			sourceOption.channel.id
		);
		const targetCategory = await interaction.guild.channels.fetch(
			targetOption.channel.id
		);

		//? Handle case where the source category is the same as the target category.
		if (sourceCategory.id === targetCategory.id) {
			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setTitle("Error")
						.setDescription(
							`\`The source category is the same as the target category.\``
						),
				],
			});

			return;
		}

		const sourceCategoryChannels: TextChannel[] = [];
		let targetCategoryChannelCount = 0;
		for (const [_, channel] of interaction.guild.channels.cache) {
			if (
				channel.parent === sourceCategory &&
				channel.type == ChannelType.GuildText
			) {
				sourceCategoryChannels.push(channel);
			}

			if (channel.parent === targetCategory) {
				targetCategoryChannelCount++;
			}
		}

		//? Handle case where the source category has no channels in it.
		if (sourceCategoryChannels.length < 1) {
			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setTitle("Error")
						.setDescription(`\`The source category has no text channels.\``),
				],
			});

			return;
		}

		if (sourceCategoryChannels.length + targetCategoryChannelCount > 50) {
			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setTitle("Error")
						.setDescription(
							`\`The target category doesn't have enough space to hold all the text channels in the source category.\``
						),
				],
			});

			return;
		}

		for (const channel of sourceCategoryChannels) {
			if (prefixOption) {
				await channel.edit({
					parent: targetCategory.id,
					name: `${prefixOption.value}-${channel.name}`,
					permissionOverwrites: targetChannelPermissions,
				});
				continue;
			}

			await channel.edit({
				parent: targetCategory.id,
				permissionOverwrites: targetChannelPermissions,
			});
		}

		if (deleteSourceOption.value === true) {
			await sourceCategory.delete();
		}

		await interaction.editReply({
			content: "Successfully archived text channels in source category.",
		});
	},
};
