import {
	SlashCommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
	type ChatInputCommandInteraction,
} from "discord.js";

export interface SlashCommand {
	data:
		| Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
		| SlashCommandSubcommandsOnlyBuilder;
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}
