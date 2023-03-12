import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";

export interface Command {
  data: SlashCommandBuilder | SlashCommandSubcommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<void>;
}
