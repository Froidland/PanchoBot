import { Interaction } from "discord.js";
import { slashCommandList } from "../handlers";

export const onInteraction = async (interaction: Interaction) => {
	if (interaction.isCommand()) {
		for (const command of slashCommandList) {
			if (interaction.commandName === command.data.name) {
				await command.execute(interaction);
				break;
			}
		}
	}
};
