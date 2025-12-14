import type { Environment } from "@ez4/common";
import type { Client, Database, Index } from "@ez4/database";
import type { PostgresEngine } from "@ez4/pg/client";
import type { GameSchema } from "@/games/schemas/game";
import type { PlayerSchema } from "@/players/schemas/player";
import { PlayerDataSchema } from "@/players/schemas/player-data";
import type { RoomSchema } from "@/rooms/schemas/room";
import type { RoomRuleSchema } from "@/rooms/schemas/rule";

export type DbClient = Db["client"];

export declare class Db extends Database.Service {
	client: Client<typeof this>;

	engine: PostgresEngine;

	scalability: {
		minCapacity: Environment.VariableOrValue<"DATABASE_MIN_CAPACITY", 0>;
		maxCapacity: Environment.VariableOrValue<"DATABASE_MAX_CAPACITY", 2>;
	};

	tables: [
		{
			name: "games";
			schema: GameSchema;
			relations: {
				"slug@rooms": "rooms:game_slug";
			};
			indexes: {
				slug: Index.Primary;
			};
		},
		{
			name: "rooms";
			schema: RoomSchema;
			relations: {
				"game_slug@game": "games:slug";
				"code@players": "players:room_code";
			};
			indexes: {
				code: Index.Primary;
				game_slug: Index.Secondary;
			};
		},
		{
			name: "players";
			schema: PlayerSchema;
			relations: {
				"room_code@room": "rooms:code";
			};
			indexes: {
				id: Index.Primary;
				room_code: Index.Secondary;
			};
		},
	];
}
