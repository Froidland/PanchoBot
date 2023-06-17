import { ApplicationFlagsBitField, Client, Events } from "discord.js";
import * as dotenv from "dotenv";
import { auth } from "osu-api-extended";
import mysql from "mysql2";
import * as winston from "winston";
import DailyRotateFile = require("winston-daily-rotate-file");
import { onInteraction, onMessageCreate, onReady } from "./events";
import { Kysely, MysqlDialect } from "kysely";
import { DB } from "kysely-codegen";
const { combine, timestamp, printf, colorize } = winston.format;
dotenv.config();

const logDatePattern = process.env.LOG_DATE_PATTERN ?? "DD-MM-YYYY";

const pool = mysql.createPool({
	host: process.env.DATABASE_HOST ?? "localhost",
	port: +(process.env.DATABASE_PORT ?? 3306),
	user: process.env.DATABASE_USER ?? null,
	password: process.env.DATABASE_PASSWORD ?? null,
	database: process.env.DATABASE_DB ?? null,
});

export const db = new Kysely<DB>({
	dialect: new MysqlDialect({
		pool,
	}),
});

export const logger = winston.createLogger({
	level: "info",
	format: combine(
		timestamp(),
		printf(({ timestamp, level, message }) => {
			return `${timestamp} [${level}] ${message}`;
		})
	),
	transports: [
		new DailyRotateFile({
			filename: "panchobot-error-%DATE%",
			extension: ".log",
			dirname: "logs",
			datePattern: logDatePattern,
			zippedArchive: true,
			maxSize: "20m",
			maxFiles: "14d",
			level: "error",
			format: combine(
				timestamp(),
				printf(({ timestamp, level, message }) => {
					return `${timestamp} [${level}] ${message}`;
				})
			),
		}),
		new DailyRotateFile({
			filename: "panchobot-main-%DATE%",
			extension: ".log",
			dirname: "logs",
			datePattern: logDatePattern,
			zippedArchive: true,
			maxSize: "20m",
			maxFiles: "14d",
			format: combine(
				timestamp(),
				printf(({ timestamp, level, message }) => {
					return `${timestamp} [${level}] ${message}`;
				})
			),
		}),
		new winston.transports.Console({
			format: winston.format.combine(
				timestamp(),
				colorize(),
				printf(({ timestamp, level, message }) => {
					return `${timestamp} [${level}] ${message}`;
				})
			),
		}),
	],
});

(async () => {
	const appFlags = new ApplicationFlagsBitField();
	appFlags.add(32768); // GatewayGuildMembersLimited
	appFlags.add(524288); // GatewayMessageContentLimited 
	appFlags.add(8192); // GatewayPresenceLimited 

	const client = new Client({
		intents: appFlags,
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
