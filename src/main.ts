import { Client, Events, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import { auth } from "osu-api-extended";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as winston from "winston";
import DailyRotateFile = require("winston-daily-rotate-file");
import { onInteraction, onMessageCreate, onReady } from "./events";
const { combine, timestamp, printf, colorize } = winston.format;
dotenv.config();

const logDatePattern = process.env.LOG_DATE_PATTERN ?? "DD-MM-YYYY";

const pool = mysql.createPool(process.env.DATABASE_URL);

export const db = drizzle(pool);

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
    await onInteraction(interaction);
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
