import type { Http } from "@ez4/gateway";
import type { NamingStyle } from "@ez4/schema";
import type { GamesRoutes } from "@/games/routes";
import type { apiListener } from "@/listener";
import type { PlayerRoutes } from "@/players/routes";
import type { MissingAuthorizationTokenError } from "./players/authorizers/errors";
import type { RoomRoutes } from "./rooms/routes";

export declare class Api extends Http.Service {
	name: "Games API";

	defaults: Http.UseDefaults<{
		listener: typeof apiListener;
		preferences: {
			namingStyle: NamingStyle.CamelCase;
		};
		httpErrors: {
			401: [MissingAuthorizationTokenError];
		};
	}>;

	cache: {
		authorizerTTL: 10;
	};

	routes: [...GamesRoutes, ...PlayerRoutes, ...RoomRoutes];

	cors: {
		allowCredentials: true;
		allowHeaders: ["authorization", "content-type"];
		allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE"];
		allowOrigins: ["http://localhost:5173", "http://localhost:5174"];
	};
}
