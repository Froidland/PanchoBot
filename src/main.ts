import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";
import { logger } from "./utils/logger.js";
import { onInteraction, onMessageCreate, onReady } from "./events/index.js";
import { db } from "./db/index.js";

export const discordClient = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

discordClient.once(Events.ClientReady, (client) => {
	logger.info({
		type: "system",
		commandName: null,
		userId: null,
		guildId: null,
		message: `logged in as ${client.user.tag}`,
	});

	client.user.setPresence({
		status: "online",
		activities: [
			{
				name: ">:3",
				type: ActivityType.Competing,
			},
		],
	});

	onReady(client);
});

discordClient.on(Events.InteractionCreate, async (interaction) => {
	try {
		await onInteraction(interaction);
	} catch (error) {
		logger.error({
			type: "system",
			commandName: null,
			userId: interaction.user.id,
			guildId: interaction.guild?.id || null,
			message: `InteractionError: ${error}`,
		});
	}
});

discordClient.on(Events.Error, async (error) => {
	logger.error({
		type: "system",
		commandName: null,
		userId: null,
		guildId: null,
		message: `DiscordError: ${error}`,
	});

	if (error.name == "ConnectTimeoutError") {
		process.exit(1);
	}
});

discordClient.on(Events.MessageCreate, (message) => {
	onMessageCreate(message);
});

if (process.env.NODE_ENV === "development") {
	logger.info({
		type: "system",
		commandName: null,
		userId: null,
		guildId: null,
		message: "using PrismaClient with logging enabled",
	});

	db.$on("info", (e) => {
		logger.debug({
			type: "prisma-info",
			commandName: null,
			userId: null,
			guildId: null,
			message: e.message,
		});
	});

	db.$on("warn", (e) => {
		logger.warn({
			type: "prisma-warning",
			commandName: null,
			userId: null,
			guildId: null,
			message: e.message,
		});
	});

	db.$on("query", (e) => {
		logger.debug({
			type: "prisma-query",
			commandName: null,
			userId: null,
			guildId: null,
			message: `${e.duration}ms ${e.query}`,
		});
	});

	db.$on("error", (e) => {
		logger.error({
			type: "prisma-error",
			commandName: null,
			userId: null,
			guildId: null,
			message: e.message,
		});
	});
}

try {
	await discordClient.login(process.env.BOT_TOKEN);

	await db.$connect();
} catch (error) {
	logger.error({
		type: "system",
		commandName: null,
		userId: null,
		guildId: null,
		message: `error while trying to start the bot: ${error}`,
	});

	process.exit(1);
}
