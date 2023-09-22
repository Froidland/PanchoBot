import { Interaction } from "discord.js";
import { contextMenuCommandList, slashCommandList } from "../handlers";

export const onInteraction = async (interaction: Interaction) => {
	if (interaction.isCommand()) {
		for (const command of slashCommandList) {
			if (interaction.commandName === command.data.name) {
				await command.execute(interaction);
				break;
			}
		}
	}

	if (interaction.isContextMenuCommand()) {
		for (const contextCommand of contextMenuCommandList) {
			if (interaction.commandName === contextCommand.data.name) {
				await contextCommand.execute(interaction);

				break;
			}
		}
	}
};
