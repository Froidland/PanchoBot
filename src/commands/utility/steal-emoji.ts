import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../interfaces/command";

export const stealEmoji: Command = {
	data: new SlashCommandBuilder()
		.setName("steal-emoji")
		.setDescription(
			"Fetches an emoji from another server and adds it to the one where the command was executed."
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
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	execute: async (interaction) => {
		await interaction.deferReply();

		const emojiOption = interaction.options.get("emoji");
		const emoji = emojiOption.value as string;

		const emojiNameOption = interaction.options.get("name");
		const emojiName = emojiNameOption?.value as string;

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

		await interaction.guild.emojis.create({
			name: emojiName || name,
			attachment: emojiAttachment,
		});

		await interaction.editReply("Emoji added.");
	},
};
