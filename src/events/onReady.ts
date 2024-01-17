import { Client, REST, Routes } from "discord.js";
import { slashCommandList, contextMenuCommandList } from "../handlers";
import { logger } from "../utils/logger";

export const onReady = async (client: Client) => {
	const rest = new REST().setToken(process.env.BOT_TOKEN);
	const slashCommandsData = slashCommandList.map((command) =>
		command.data.toJSON(),
	);
	const contextMenuCommandsData = contextMenuCommandList.map((command) =>
		command.data.toJSON(),
	);

	if (process.env.DEV_GUILD_ID) {
		try {
			await rest.put(
				Routes.applicationGuildCommands(
					client.user.id,
					process.env.DEV_GUILD_ID,
				),
				{ body: [...slashCommandsData, ...contextMenuCommandsData] },
			);
		} catch (error) {
			logger.error({
				type: "system",
				commandName: null,
				userId: null,
				guildId: null,
				message: `unable to register guild commands for guild ${process.env.DEV_GUILD_ID}: ${error}`,
			});

			process.exit(1);
		}

		logger.info({
			type: "system",
			commandName: null,
			userId: null,
			guildId: null,
			message: `registered commands for guild ${process.env.DEV_GUILD_ID} (${slashCommandList.length} slash, ${contextMenuCommandList.length} context menu)`,
		});

		return;
	}

	try {
		await rest.put(Routes.applicationCommands(client.user.id), {
			body: [...slashCommandsData, ...contextMenuCommandsData],
		});
	} catch (error) {
		logger.error({
			type: "system",
			commandName: null,
			userId: null,
			guildId: null,
			message: `unable to register global commands: ${error}`,
		});

		process.exit(1);
	}

	logger.info({
		type: "system",
		commandName: null,
		userId: null,
		guildId: null,
		message: `registered global commands (${slashCommandList.length} slash, ${contextMenuCommandList.length} context menu)`,
	});
};
