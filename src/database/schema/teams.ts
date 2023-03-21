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
import { users } from "./users";

export const teams = mysqlTable("teams", {
  id: bigint("id", { mode: "number" }).autoincrement(),
  name: varchar("name", { length: 64 }),

  preferredTimezone: mysqlEnum("preferred_timezone", [
    "-12UTC",
    "-11UTC",
    "-10UTC",
    "-9UTC",
    "-8UTC",
    "-7UTC",
    "-6UTC",
    "-5UTC",
    "-4UTC",
    "-3UTC",
    "-2UTC",
    "-1UTC",
    "0UTC",
    "1UTC",
    "2UTC",
    "3UTC",
    "4UTC",
    "5UTC",
    "6UTC",
    "7UTC",
    "8UTC",
    "9UTC",
    "10UTC",
    "11UTC",
    "12UTC",
  ]).notNull(),

  captainId: bigint("captain_id", { mode: "number" }).references(
    () => users.discordId,
    {
      onDelete: "no action",
      onUpdate: "cascade",
    }
  ),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).onUpdateNow(),
});

export type Team = InferModel<typeof teams, "insert">;
