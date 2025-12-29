import type { Object } from "@ez4/schema";

export const enum UserStatus {
  Disabled = "disabled",
  Enabled = "enabled",
}

export const enum ClerkUserEvent {
  Created = "user.created",
  Updated = "user.updated",
  Deleted = "user.deleted",
}

export type ClerkUserCreatedEvent = Object.Extends<{
  type: ClerkUserEvent.Created;
  data: ClerkUserData;
}>;

export type ClerkUserUpdatedEvent = Object.Extends<{
  type: ClerkUserEvent.Updated;
  data: ClerkUserData;
}>;

export type ClerkUserDeletedEvent = Object.Extends<{
  type: ClerkUserEvent.Deleted;
  data: Object.Extends<{
    id: string;
    deleted: boolean;
  }>;
}>;

export type ClerkUserData = Object.Extends<{
  id: string;
  banned: boolean;
  locked: boolean;
  first_name?: string;
  last_name?: string;
  image_url?: string;
  primary_email_address_id: string;
  email_addresses: ClerkUserEmail[];
  created_at: number;
}>;

export type ClerkUserEmail = Object.Extends<{
  id: string;
  email_address: string;
}>;

export type ClerkUserPhone = Object.Extends<{
  id: string;
  phone_number: string;
}>;
