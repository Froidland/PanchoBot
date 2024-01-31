import { mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
	discord_id: varchar("discord_id", { length: 191 }).primaryKey(),
	personal_server_id: varchar("personal_server_id", { length: 191 }),
});
