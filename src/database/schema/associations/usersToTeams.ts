import { bigint, mysqlTable, timestamp } from "drizzle-orm/mysql-core";
import { teams } from "../teams";
import { users } from "../users";

//? Associative table because many players (users) can be part of many teams.
export const usersToTeams = mysqlTable("users_to_teams", {
  userId: bigint("user_id", { mode: "number" })
    .notNull()
    .references(() => users.discordId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  teamId: bigint("team_id", { mode: "bigint" })
    .notNull()
    .references(() => teams.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).onUpdateNow(),
});
