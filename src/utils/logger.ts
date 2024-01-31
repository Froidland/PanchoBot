import * as winston from "winston";
const { prettyPrint, combine, json, timestamp } = winston.format;
import { WinstonTransport as AxiomTransport } from "@axiomhq/winston";

const consoleTransport = new winston.transports.Console({
	format: combine(json(), prettyPrint(), timestamp()),
});

export const logger = winston.createLogger({
	level: process.env.NODE_ENV === "development" ? "debug" : "info",
	format: combine(json(), prettyPrint(), timestamp()),
	transports: [consoleTransport],
	exceptionHandlers: [consoleTransport],
	rejectionHandlers: [consoleTransport],
});

if (process.env.AXIOM_DATASET && process.env.AXIOM_TOKEN) {
	const axiomTransport = new AxiomTransport({
		dataset: process.env.AXIOM_DATASET,
		token: process.env.AXIOM_TOKEN,
		format: combine(json(), prettyPrint(), timestamp()),
	});

	logger.add(axiomTransport);

	logger.exceptions.handle(axiomTransport);
	logger.rejections.handle(axiomTransport);

	logger.info({
		type: "system",
		name: null,
		user: null,
		guild: null,
		message: "added Axiom transport",
	});
}
