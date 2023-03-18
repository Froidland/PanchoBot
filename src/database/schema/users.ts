import {
  bigint,
  varchar,
  mysqlTable,
  int,
  timestamp,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  discordId: bigint("discord_id", { mode: "number" }).primaryKey(),
  userId: int("user_id"), // This is the user's osu! account id.
  username: varchar("username", { length: 32 }),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).onUpdateNow(),
});
