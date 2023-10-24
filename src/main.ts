import { Client, Events, GatewayIntentBits } from "discord.js";
import logger from "./utils/logger";
import { onInteraction, onMessageCreate, onReady } from "./events";
import db from "./db";

export const discordClient = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

(async () => {
	discordClient.once(Events.ClientReady, async (client) => {
		logger.info(`Logged in as ${client.user.tag}`);
		await onReady(client);
	});

	discordClient.on(Events.InteractionCreate, async (interaction) => {
		try {
			await onInteraction(interaction);
		} catch (error) {
			logger.error(`InteractionError: ${error}`);
		}
	});

	discordClient.on(Events.Error, async (error) => {
		logger.error(error.stack);

		if (error.name == "ConnectTimeoutError") {
			process.exit(1);
		}
	});

	discordClient.on(Events.MessageCreate, async (message) => {
		await onMessageCreate(message);
	});

	if (process.env.NODE_ENV === "development") {
		logger.info("Using PrismaClient with logging enabled.");

		db.$on("info", (e) => {
			logger.debug(e.message);
		});

		db.$on("warn", (e) => {
			logger.warn(e.message);
		});

		db.$on("query", (e) => {
			logger.debug(e.duration + "ms " + e.query);
		});

		db.$on("error", (e) => {
			logger.error(e.message);
		});
	}

	try {
		await discordClient.login(process.env.BOT_TOKEN);

		await db.$connect();
	} catch (error) {
		logger.error(
			`There was an error while trying to start the bot. Reason: ${error}`,
		);
		process.exit(1);
	}
})();
