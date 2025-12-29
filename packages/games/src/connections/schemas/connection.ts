import type { Database } from "@ez4/database";
import type { String } from "@ez4/schema";
import type { RealtimeTriggerType } from "../types/triggers";

export interface ConnectionSchema extends Database.Schema {
  /**
   * Connection Id.
   */
  id: String.UUID;

  /**
   * External connection Id.
   */
  external_id: string;

  /**
   * The associated game session ID.
   */
  user_id?: string;

  /**
   * Stream sources.
   */
  triggers: RealtimeTriggerType[];

  /**
   * Creation date.
   */
  created_at: String.DateTime;

  /**
   * Timestamp indicating when the record is automatically removed.
   */
  expire_at: number;
}
