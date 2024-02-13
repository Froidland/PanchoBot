import { Interaction } from "discord.js";
import { contextMenuCommandList, slashCommandList } from "../handlers/index.js";

export const onInteraction = async (interaction: Interaction) => {
	if (interaction.isChatInputCommand()) {
		for (const command of slashCommandList) {
			if (interaction.commandName === command.data.name) {
				command.execute(interaction);

				break;
			}
		}
	}

	if (interaction.isContextMenuCommand()) {
		for (const contextCommand of contextMenuCommandList) {
			if (interaction.commandName === contextCommand.data.name) {
				contextCommand.execute(interaction);

				break;
			}
		}
	}
};
