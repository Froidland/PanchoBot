import DailyRotateFile = require("winston-daily-rotate-file");
import * as winston from "winston";
const { combine, timestamp, printf, colorize } = winston.format;
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

export default logger;
