import {
	CommandInteraction,
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

export interface Command {
	data:
		| Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
		| SlashCommandSubcommandsOnlyBuilder;
	execute: (interaction: CommandInteraction) => Promise<void>;
}
