import type { Environment } from "@ez4/common";
import type { Http } from "@ez4/gateway";
import type { EventsQueue } from "@/connections/queues/events";
import type { Db } from "@/database/postgres";

export declare class ApiProvider implements Http.Provider {
  services: {
    variables: Environment.ServiceVariables;
    db: Environment.Service<Db>;
    eventsQueue: Environment.Service<EventsQueue>;
  };
}
