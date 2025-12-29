import type { Environment } from "@ez4/common";
import type {
  Http,
  HttpInternalServerError,
  HttpNotFoundError,
} from "@ez4/gateway";
import type { GamesRoutes } from "@/games/routes";
import type { apiListener } from "@/listener";
import type { MissingAuthorizationTokenError } from "@/players/authorizers/errors";
import type { PlayerRoutes } from "@/players/routes";
import type { RoomRoutes } from "@/rooms/routes";
import type { UserRoutes } from "@/users/routes";

export declare class Api extends Http.Service {
  name: "Games API";

  defaults: Http.UseDefaults<{
    listener: typeof apiListener;
    httpErrors: {
      401: [MissingAuthorizationTokenError];
      404: [HttpNotFoundError];
      500: [HttpInternalServerError];
    };
  }>;

  cache: {
    authorizerTTL: 10;
  };

  routes: [...GamesRoutes, ...PlayerRoutes, ...RoomRoutes, ...UserRoutes];

  cors: {
    allowCredentials: true;
    allowHeaders: ["authorization", "content-type"];
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE"];
    allowOrigins: ["http://localhost:5173", "http://localhost:5174"];
  };

  variables: {
    CLERK_HEADER_SECRET: Environment.Variable<"CLERK_HEADER_SECRET">;
    CLERK_SECRET_KEY: Environment.Variable<"CLERK_SECRET_KEY">;
  };
}
