import {
	type ChatInputCommandInteraction,
	type SlashCommandOptionsOnlyBuilder,
} from "discord.js";

export interface SlashCommand {
	data: SlashCommandOptionsOnlyBuilder;
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}
