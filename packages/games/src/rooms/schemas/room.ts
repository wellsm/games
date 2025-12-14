import type { Database } from "@ez4/database";
import type { Object, String } from "@ez4/schema";
import type { GameStatus } from "@/games/types";

export interface RoomSchema extends Database.Schema {
	/**
	 * The unique identifier for the game session, Room code.
	 */
	code: string;

	/**
	 * The associated game ID.
	 */
	game_slug: string;

	/**
	 * The name of the game.
	 */
	status: GameStatus;

	/**
	 * Current turn number.
	 */
	turn: number;

	/**
	 * The winner player ID.
	 */
	winner?: String.UUID;

	/**
	 * The custom rules for each game/room
	 */
	rules?: Object.Any;

	/**
	 * Creation date.
	 */
	created_at: String.DateTime;

	/**
	 * Last update date.
	 */
	updated_at: String.DateTime;
}
