import { ContextMenuCommand } from "../../interfaces";
import {
	ApplicationCommandType,
	ContextMenuCommandBuilder,
	MessageContextMenuCommandInteraction,
	PermissionFlagsBits,
} from "discord.js";

export const addEmoji: ContextMenuCommand = {
	data: new ContextMenuCommandBuilder()
		.setName("Add emoji")
		.setType(ApplicationCommandType.Message)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions)
		.setDMPermission(false),
	execute: async (interaction) => {
		await interaction.deferReply();

		interaction = interaction as MessageContextMenuCommandInteraction;

		const emojiRegex = /<?(a)?:?(\w{2,32}):(\d{17,19})>?/; // Example: <:pepega:123456789012345678>
		const match = interaction.targetMessage.content.match(emojiRegex);

		if (!match) {
			await interaction.editReply("Invalid emoji.");
			return;
		}

		const [, animated, name, id] = match;
		const url = `https://cdn.discordapp.com/emojis/${id}.${
			animated ? "gif" : "png"
		}`;

		const emojiResponse = await fetch(url);

		if (!emojiResponse.ok) {
			await interaction.editReply("Failed to fetch emoji.");
			return;
		}

		const emojiAttachment = Buffer.from(await emojiResponse.arrayBuffer());

		// Non-null because the command is guild-only.
		const createdEmoji = await interaction.guild!.emojis.create({
			name: name,
			attachment: emojiAttachment,
		});

		await interaction.editReply(`Added emoji ${createdEmoji}`);
	},
};
