import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema.js";
import mysql from "mysql2/promise";
import { Logger } from "drizzle-orm";
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

const poolConnection = mysql.createPool({
	uri: process.env.DATABASE_URL,
});

export const db = drizzle(poolConnection, {
	schema,
	mode: "default",
	logger: new DbLogger(),
});
