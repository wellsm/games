import type { Http } from "@ez4/gateway";

export declare class AuthorizePlayerRequest implements Http.AuthRequest {
	headers: {
		authorization: string;
	};
}

export type PlayerIdentity = {
	id: string;
};

export declare class AuthorizePlayerResponse implements Http.AuthResponse {
	identity: PlayerIdentity;
}
