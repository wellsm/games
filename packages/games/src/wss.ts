import type { Environment } from "@ez4/common";
import type { Ws } from "@ez4/gateway";
import type { connectHandler } from "@/connections/actions/connect";
import type { disconnectHandler } from "@/connections/actions/disconnect";
import type { messageHandler } from "@/connections/actions/message";
import type { RealtimeEvents } from "@/connections/types/events";
import type { Dynamo } from "@/database/dynamo";
import type { clerkUserWsAuthorizer } from "./users/authorizers/users";

export declare class WsApi extends Ws.Service<RealtimeEvents> {
  name: "Games WS";

  stage: "ws-events";

  defaults: Ws.UseDefaults<{
    logRetention: 14;
  }>;

  connect: Ws.UseConnect<{
    handler: typeof connectHandler;
    authorizer: typeof clerkUserWsAuthorizer;
  }>;

  disconnect: Ws.UseDisconnect<{
    handler: typeof disconnectHandler;
  }>;

  message: Ws.UseMessage<{
    handler: typeof messageHandler;
  }>;

  services: {
    realtimeDb: Environment.Service<Dynamo>;
  };
}
