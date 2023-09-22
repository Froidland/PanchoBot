import { Client, REST, Routes } from "discord.js";
import { slashCommandList } from "../handlers";
import logger from "../utils/logger";

export const onReady = async (client: Client) => {
	const rest = new REST().setToken(process.env.BOT_TOKEN);
	const commandData = slashCommandList.map((command) => command.data.toJSON());

	if (process.env.DEV_GUILD_ID) {
		await rest.put(
			Routes.applicationGuildCommands(client.user.id, process.env.DEV_GUILD_ID),
			{ body: commandData }
		);
		logger.info("Registered guild commands successfully!");
		return;
	}

	await rest.put(Routes.applicationCommands(client.user.id), {
		body: commandData,
	});
	logger.info("Registered global commands successfully!");

	// Command deletion.
	/* 
  // for guild-based commands
  await rest
    .put(
      Routes.applicationGuildCommands(client.user.id, process.env.DEV_GUILD_ID),
      { body: [] }
    )
    .then(() => console.log("Successfully deleted all guild commands."))
    .catch(console.error);

  // for global commands
  await rest
    .put(Routes.applicationCommands(client.user.id), { body: [] })
    .then(() => console.log("Successfully deleted all application commands."))
    .catch(console.error); */
};
