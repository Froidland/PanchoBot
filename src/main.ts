import { Client, Events, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import { auth } from "osu-api-extended";
import logger from "./utils/logger"
import { onInteraction, onMessageCreate, onReady } from "./events";
dotenv.config();

(async () => {
	const client = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent,
		],
	});

	client.once(Events.ClientReady, async (client) => {
		logger.info(`Logged in as ${client.user.tag}`);
		await onReady(client);
	});

	client.on(Events.InteractionCreate, async (interaction) => {
		try {
			await onInteraction(interaction);
		} catch (error) {
			logger.error(`InteractionError: ${error}`);
		}
	});

	client.on(Events.Error, async (error) => {
		logger.error(error.stack);

		if (error.name == "ConnectTimeoutError") {
			process.exit(1);
		}
	});

	client.on(Events.MessageCreate, async (message) => {
		await onMessageCreate(message);
	});

	try {
		await auth.login(+process.env.OSU_CLIENT_ID, process.env.OSU_CLIENT_SECRET);
		await client.login(process.env.BOT_TOKEN);
	} catch (error) {
		logger.error(
			`There was an error while trying to start the bot. Reason: ${error}`
		);
		process.exit(1);
	}
})();
