import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema.js";
import { type Logger } from "drizzle-orm";
import { logger } from "../utils/logger.js";

class DbLogger implements Logger {
	logQuery(query: string, params: unknown[]): void {
		logger.debug({
			type: "query",
			message: query,
			params: params,
		});
	}
}

const connectionUrl = process.env.DB_URL;

if (!connectionUrl) {
	throw new Error("DB_URL must be provided");
}

export const db = drizzle({
	connection: { url: connectionUrl },
	schema,
	casing: "snake_case",
	logger: new DbLogger(),
});
