import {
	CommandInteraction,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../interfaces/command";

export const addEmoji: Command = {
	data: new SlashCommandBuilder()
		.setName("add-emoji")
		.setDescription(
			"Adds the first specified emoji to the server where the command is executed."
		)
		.addStringOption((option) =>
			option
				.setName("emoji")
				.setDescription("Emoji to steal.")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("name")
				.setDescription("Name of the emoji.")
				.setMinLength(2)
				.setRequired(false)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions)
		.setDMPermission(false),
	execute: async (interaction: CommandInteraction) => {
		await interaction.deferReply();

		const emojiOption = interaction.options.get("emoji");
		const emoji = emojiOption.value as string;

		const emojiNameOption = interaction.options.get("name");
		const emojiName = emojiNameOption?.value as string;

		// Regex for matching custom discord emoji
		// First capture group is for animated emojis (whether it has an "a" in front of it or not)
		// Second capture group is for the emoji name (2-32 characters long)
		// Third capture group is for the emoji id (17-19 characters long)
		const emojiRegex = /<?(a)?:?(\w{2,32}):(\d{17,19})>?/;
		const match = emoji.match(emojiRegex);

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

		const createdEmoji = await interaction.guild.emojis.create({
			name: emojiName || name,
			attachment: emojiAttachment,
		});

		await interaction.editReply(`Added emoji ${createdEmoji}`);
	},
};
