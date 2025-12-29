import type { Database } from "@ez4/database";
import type { String } from "@ez4/schema";
import type { UserStatus } from "@/users/types";

export interface UserSchema extends Database.Schema {
  /**
   * User Id.
   */
  id: string;

  /**
   * User Full Name
   */
  name: string;

  /**
   * User Primary Email
   */
  email?: string;

  /**
   * User status.
   */
  status: UserStatus;

  /**
   * User Image
   */
  avatar?: string;

  /**
   * Creation date.
   */
  created_at: String.DateTime;

  /**
   * Last update date.
   */
  updated_at: String.DateTime;

  /**
   * Deletion date.
   */
  deleted_at?: String.DateTime | null;
}
