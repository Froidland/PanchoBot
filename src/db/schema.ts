import { pgTable } from "drizzle-orm/pg-core";

export const users = pgTable("users", (t) => ({
	discord_id: t.varchar("discord_id", { length: 191 }).primaryKey(),
	personal_server_id: t.varchar("personal_server_id", { length: 191 }),
}));
