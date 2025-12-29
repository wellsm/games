import type { Service } from "@ez4/common";
import type { Ws } from "@ez4/gateway";
import { updateConnection } from "@/connections/repositories/connection";
import type {
  RealtimeAckMessage,
  RealtimeAliveMessage,
  RealtimeSubscribeMessage,
} from "@/connections/types/messages";
import { RealtimeMessageType } from "@/connections/types/messages";
import type { PlayerIdentity } from "@/players/authorizers/types";
import type { WsApi } from "@/wss";

declare class MessageRequest implements Ws.Request {
  identity: PlayerIdentity;
  body: RealtimeSubscribeMessage | RealtimeAliveMessage;
}

declare class MessageResponse implements Ws.Response {
  body: RealtimeAckMessage;
}

export async function messageHandler(
  event: Ws.Incoming<MessageRequest>,
  context: Service.Context<WsApi>
): Promise<MessageResponse> {
  const { connectionId, body } = event;
  const { realtimeDb } = context;

  if (body.type === RealtimeMessageType.Subscribe) {
    await updateConnection(realtimeDb, connectionId, {
      triggers: body.triggers,
    });
  }

  return {
    body: {
      type: RealtimeMessageType.Ack,
    },
  };
}
