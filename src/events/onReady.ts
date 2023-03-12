import { Client, REST, Routes } from "discord.js";
import { commandList } from "../commands/_commandList";
import { logger } from "../main";

export const onReady = async (client: Client) => {
  const rest = new REST().setToken(process.env.BOT_TOKEN);
  const commandData = commandList.map((command) => command.data.toJSON());

  if (process.env.DEV_GUILD_ID) {
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, process.env.DEV_GUILD_ID),
      { body: commandData }
    );
  }

  logger.info("Registered commands successfully!");
};
