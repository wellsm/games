import type { Database } from "@ez4/database";
import type { String } from "@ez4/schema";
import type { AnyGameRules, GameStatus, WhichGame } from "@games/common";

export interface RoomSchema extends Database.Schema {
  /**
   * The unique identifier for the game session, Room code.
   */
  code: string;

  /**
   * The associated game ID.
   */
  game: WhichGame;

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
  rules?: AnyGameRules;

  /**
   * Creation date.
   */
  created_at: String.DateTime;

  /**
   * Last update date.
   */
  updated_at: String.DateTime;
}
