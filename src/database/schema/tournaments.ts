import {
  bigint,
  InferModel,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { users } from "./users";

export const tournaments = mysqlTable("tournaments", {
  id: bigint("id", { mode: "number" }).autoincrement(),
  name: varchar("name", { length: 64 }).notNull(),
  acronym: varchar("acronym", { length: 8 }).notNull(),

  serverId: bigint("server_id", { mode: "number" }).notNull(),
  schedulesChannelId: bigint("schedules_channel_id", {
    mode: "number",
  }).notNull(),
  refereeChannelId: bigint("referee_channel_id", { mode: "number" }).notNull(),
  staffChannelId: bigint("staff_channel_id", { mode: "number" }).notNull(),
  creatorId: bigint("creator_id", { mode: "number" })
    .references(() => users.discordId, {
      onDelete: "no action",
      onUpdate: "cascade",
    })
    .notNull(),

  winCondition: mysqlEnum("win_condition", ["score", "acc", "misses"]).default(
    "score"
  ),
  scoring: mysqlEnum("scoring", ["v1", "v2", "lazer"]).default("v2").notNull(),
  type: mysqlEnum("type", ["team_based", "one_vs_one", "battle_royale"])
    .default("team_based")
    .notNull(),

  staffRoleId: bigint("staff_role_id", { mode: "number" }).notNull(),
  refereeRoleId: bigint("referee_role_id", { mode: "number" }).notNull(),
  playerRoleId: bigint("player_role_id", { mode: "number" }).notNull(),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

export type Tournament = InferModel<typeof tournaments, "insert">;
