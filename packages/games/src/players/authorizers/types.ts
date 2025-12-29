import type { Http, Ws } from "@ez4/gateway";

export declare class AuthorizePlayerRequest implements Http.AuthRequest {
  headers: {
    authorization: string;
  };
}

export type PlayerIdentity = {
  id: string;
};

export declare class AuthorizeWsPlayerRequest implements Ws.AuthRequest {
  query: {
    auth: string;
  };
}

export declare class AuthorizePlayerResponse implements Http.AuthResponse {
  identity: PlayerIdentity;
}

export declare class AuthorizeWsPlayerResponse implements Ws.AuthResponse {
  identity: PlayerIdentity;
}
