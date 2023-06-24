import type { Generated } from "kysely";

export interface Lobbies {
	id: string;
	tournament_id: string;
	named_id: string;
	schedule: Date;
	status: Generated<"done" | "pending">;
	stage:
		| "finals"
		| "grandfinals"
		| "groups"
		| "qualifiers"
		| "quarterfinals"
		| "round_16"
		| "round_32"
		| "round_64"
		| "semifinals";
	mp_link: Generated<string | null>;
	created_at: Generated<Date>;
	updated_at: Generated<Date | null>;
}

export interface LobbiesToTeams {
	lobby_id: string;
	team_id: string;
	created_at: Generated<Date>;
	updated_at: Generated<Date | null>;
}

export interface Teams {
	id: string;
	name: string;
	preferred_timezone:
		| "-10UTC"
		| "-11UTC"
		| "-12UTC"
		| "-1UTC"
		| "-2UTC"
		| "-3UTC"
		| "-4UTC"
		| "-5UTC"
		| "-6UTC"
		| "-7UTC"
		| "-8UTC"
		| "-9UTC"
		| "0UTC"
		| "10UTC"
		| "11UTC"
		| "12UTC"
		| "1UTC"
		| "2UTC"
		| "3UTC"
		| "4UTC"
		| "5UTC"
		| "6UTC"
		| "7UTC"
		| "8UTC"
		| "9UTC";
	captain_id: number;
	created_at: Generated<Date>;
	updated_at: Generated<Date | null>;
}

export interface Tournaments {
	id: string;
	name: string;
	acronym: string;
	server_id: number;
	schedules_channel_id: number;
	referee_channel_id: number;
	staff_channel_id: number;
	creator_id: number;
	win_condition: Generated<"acc" | "misses" | "score">;
	scoring: Generated<"lazer" | "v1" | "v2">;
	type: Generated<"battle_royale" | "one_vs_one" | "team_based">;
	staff_role_id: number;
	referee_role_id: number;
	player_role_id: number;
	created_at: Generated<Date>;
}

export interface Users {
	discord_id: number;
	user_id: Generated<number | null>;
	username: Generated<string | null>;
	money: Generated<number>;
	created_at: Generated<Date>;
	updated_at: Generated<Date | null>;
}

export interface UsersToTeams {
	user_id: number;
	team_id: string;
	created_at: Generated<Date>;
	updated_at: Generated<Date | null>;
}

export interface DB {
	lobbies: Lobbies;
	lobbies_to_teams: LobbiesToTeams;
	teams: Teams;
	tournaments: Tournaments;
	users: Users;
	users_to_teams: UsersToTeams;
}
