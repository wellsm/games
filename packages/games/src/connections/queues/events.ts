import type { Environment, Service } from "@ez4/common";
import type { Queue } from "@ez4/queue";
import { Tasks } from "@ez4/utils";
import type { Dynamo } from "@/database/dynamo";
import type { WsApi } from "@/wss";
import { listAllConnections } from "../repositories/connection";
import { RealtimeEventType } from "../types/events";
import type { RealtimeTriggerType } from "../types/triggers";

export type EventMessage = {
  trigger: RealtimeTriggerType;
  usersIds: string[];
};

/**
 * Queue for streaming events through the WebSocket API.
 */
export declare class EventsQueue extends Queue.Service<EventMessage> {
  retention: 1440;

  deadLetter: {
    maxRetries: 3;
  };

  subscriptions: [
    {
      handler: typeof processMessage;
    },
  ];

  services: {
    dynamo: Environment.Service<Dynamo>;
    ws: Environment.Service<WsApi>;
  };
}

export async function processMessage(
  request: Queue.Incoming<EventMessage>,
  context: Service.Context<EventsQueue>
) {
  const { trigger, usersIds } = request.message;
  const { dynamo, ws } = context;

  const allConnectionIds = await listAllConnections(dynamo, {
    usersIds,
    trigger,
  });

  console.log(allConnectionIds);

  const tasks = allConnectionIds.map((connectionId) => {
    return () =>
      ws.sendMessage(connectionId, {
        type: RealtimeEventType.Refresh,
        trigger,
      });
  });

  await Tasks.safeRun(tasks, 25);
}
