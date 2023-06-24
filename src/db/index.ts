import { Kysely, MysqlDialect } from "kysely";
import mysql from "mysql2";
import { DB } from "./schema";
import * as dotenv from "dotenv";
dotenv.config();

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

export default db;
