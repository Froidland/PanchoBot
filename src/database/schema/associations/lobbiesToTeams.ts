import { bigint, mysqlTable, timestamp } from "drizzle-orm/mysql-core";
import { lobbies } from "../lobbies";
import { teams } from "../teams";

//? Associative table because many teams can be part of many lobbies due to a tournament having many stages with multiple lobbies each.
export const lobbiesToTeams = mysqlTable("lobbies_to_teams", {
  lobbyId: bigint("lobby_id", { mode: "bigint" })
    .notNull()
    .references(() => lobbies.id, {
      onDelete: "no action",
      onUpdate: "cascade",
    }),
  teamId: bigint("team_id", { mode: "bigint" })
    .notNull()
    .references(() => teams.id, {
      onDelete: "no action",
      onUpdate: "cascade",
    }),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).onUpdateNow(),
});
