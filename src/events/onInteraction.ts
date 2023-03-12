import { Interaction } from "discord.js";
import { commandList } from "../commands/_commandList";

export const onInteraction = async (interaction: Interaction) => {
  if (interaction.isCommand()) {
    for (const command of commandList) {
      if (interaction.commandName === command.data.name) {
        await command.execute(interaction);
        break;
      }
    }
  }
};
