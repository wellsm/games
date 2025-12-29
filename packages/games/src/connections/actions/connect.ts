import type { Service } from "@ez4/common";
import type { Ws } from "@ez4/gateway";
import type { UserIdentity } from "@/users/authorizers/users";
import type { WsApi } from "@/wss";
import { registerConnection } from "../repositories/connection";

declare class ConnectEvent implements Ws.Event {
  identity: UserIdentity;
}

export async function connectHandler(
  event: Ws.Incoming<ConnectEvent>,
  context: Service.Context<WsApi>
) {
  const {
    connectionId,
    identity: { id: userId },
  } = event;
  const { realtimeDb } = context;

  console.log(userId);

  await registerConnection(realtimeDb, {
    connectionId,
    userId,
  });
}
