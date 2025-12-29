import type { Service } from "@ez4/common";
import type { Ws } from "@ez4/gateway";
import type { WsApi } from "@/wss";
import { removeConnection } from "../repositories/connection";

declare class DisconnectEvent implements Ws.Event {}

export async function disconnectHandler(
  event: Ws.Incoming<DisconnectEvent>,
  context: Service.Context<WsApi>
) {
  const { connectionId } = event;
  const { realtimeDb } = context;

  await removeConnection(realtimeDb, connectionId);
}
