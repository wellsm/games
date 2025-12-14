import type { Database } from "@ez4/database";
import type { Object, String } from "@ez4/schema";

export interface PlayerSchema extends Database.Schema {
	/**
	 * The unique identifier for the player.
	 */
	id: string;

	/**
	 * The display name of the player.
	 */
	name: string;

	/**
	 * The associated game session ID.
	 */
	room_code: string;

	/**
	 * The custom player data for each game/room/player
	 */
	data?: Object.Any;

	/**
	 * The player's current seat number in the game.
	 */
	seat: number;

	/**
	 * The player's current score in the game.
	 */
	score: number;

	/**
	 * Indicates if the player is the owner of the game session.
	 */
	is_owner: boolean;

	/**
	 * Creation date.
	 */
	created_at: String.DateTime;

	/**
	 * Last update date.
	 */
	updated_at: String.DateTime;
}
