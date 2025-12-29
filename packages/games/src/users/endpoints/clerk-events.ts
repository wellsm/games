import type { Service } from "@ez4/common";
import type { Http } from "@ez4/gateway";
import { getCurrentIsoDateTime } from "@games/common";
import type { ApiProvider } from "@/provider";
import {
  type ClerkUserCreatedEvent,
  type ClerkUserDeletedEvent,
  ClerkUserEvent,
  type ClerkUserUpdatedEvent,
  UserStatus,
} from "@/users/types";
import { deleteUser, upsertUser } from "../repositories/user";

declare class ClerkUserEventsRequest implements Http.Request {
  body: ClerkUserCreatedEvent | ClerkUserUpdatedEvent | ClerkUserDeletedEvent;
}

export async function clerkUserEventsHandler(
  request: ClerkUserEventsRequest,
  context: Service.Context<ApiProvider>
): Promise<Http.SuccessEmptyResponse> {
  const { db } = context;
  const { type, data } = request.body;

  if (type === ClerkUserEvent.Deleted) {
    await deleteUser(db, {
      id: data.id,
      deleted_at: getCurrentIsoDateTime(),
    });
  }

  if (type === ClerkUserEvent.Created || type === ClerkUserEvent.Updated) {
    await upsertUser(db, {
      id: data.id,
      name: `${data.first_name} ${data.last_name}`.trim(),
      email: data.email_addresses.find(
        ({ id }) => id === data.primary_email_address_id
      )?.email_address,
      status: UserStatus.Enabled,
      avatar: data.image_url,
      created_at: getCurrentIsoDateTime(),
      updated_at: getCurrentIsoDateTime(),
    });
  }

  return {
    status: 204,
  };
}
