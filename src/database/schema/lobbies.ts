import {
  bigint,
  date,
  InferModel,
  mysqlEnum,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { tournaments } from "./tournaments";

export const lobbies = mysqlTable("lobbies", {
  id: bigint("id", { mode: "number" }).autoincrement(),
  tournamentId: bigint("tournament_id", { mode: "number" })
    .notNull()
    .references(() => tournaments.id, {
      onDelete: "no action",
      onUpdate: "cascade",
    }),
  namedId: varchar("named_id", { length: 16 }),
  schedule: date("schedule", { mode: "date" }),
  status: mysqlEnum("status", ["pending", "done"]).default("pending"),
  stage: mysqlEnum("stage", [
    "groups",
    "qualifiers",
    "round_64",
    "round_32",
    "round_16",
    "quarterfinals",
    "semifinals",
    "finals",
    "grandfinals",
  ]).notNull(),

  mpLink: varchar("mp_link", { length: 256 }),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).onUpdateNow(),
});

export type Lobby = InferModel<typeof lobbies, "insert">;
