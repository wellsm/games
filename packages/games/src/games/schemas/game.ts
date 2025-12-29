import type { Database } from "@ez4/database";
import type { String } from "@ez4/schema";
import type { WhichGame } from "@games/common";

export interface GameSchema extends Database.Schema {
  /**
   * The unique identifier for the game.
   */
  slug: WhichGame;

  /**
   * The name of the game.
   */
  name: string;

  /**
   * A brief description of the game.
   */
  description: string;

  /**
   * Creation date.
   */
  created_at: String.DateTime;

  /**
   * Last update date.
   */
  updated_at: String.DateTime;
}
