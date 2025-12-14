import type { Environment } from "@ez4/common";
import type { Http } from "@ez4/gateway";

export declare class Api extends Http.Service {
	name: Environment.Variable<"SEQUENCE_WORDS_API_NAME">;

	cache: {
		authorizerTTL: 10;
	};

	routes: [];

	cors: {
		allowCredentials: true;
		allowHeaders: ["authorization", "content-type"];
		allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE"];
		allowOrigins: ["http://localhost:5173", "http://localhost:5174"];
	};
}
