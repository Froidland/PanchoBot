import { Client, Events, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import * as winston from "winston";
import DailyRotateFile = require("winston-daily-rotate-file");
import { onInteraction } from "./events/onInteraction";
import { onReady } from "./events/onReady";
const { combine, timestamp, printf, colorize } = winston.format;
dotenv.config();

const logDatePattern = process.env.LOG_DATE_PATTERN ?? "DD-MM-YYYY";

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
  const client = new Client({ intents: GatewayIntentBits.Guilds });

  client.once(Events.ClientReady, async (client) => {
    logger.info(`Logged in as ${client.user.tag}`);
    await onReady(client);
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    await onInteraction(interaction);
  });

  try {
    await client.login(process.env.BOT_TOKEN);
  } catch (error) {
    logger.error(`There was an error while trying to log in. Reason: ${error}`);
  }
})();
