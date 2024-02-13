import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

export default {
	schema: "./src/db/schema.ts",
	out: "./drizzle/migrations",
	driver: "mysql2",
	dbCredentials: {
		uri: process.env.DATABASE_URL || "mysql://localhost:3306/panchobot",
	},
} satisfies Config;
