import { MissingAuthorizationTokenError } from "./errors";
import type {
  AuthorizePlayerRequest,
  AuthorizePlayerResponse,
  AuthorizeWsPlayerRequest,
  AuthorizeWsPlayerResponse,
} from "./types";

export function anyPlayerAuthorizer(
  request: AuthorizePlayerRequest
): AuthorizePlayerResponse {
  const [, token] = request.headers.authorization.split(" ");

  if (!token) {
    throw new MissingAuthorizationTokenError();
  }

  return {
    identity: {
      id: token,
    },
  };
}

export function anyWsPlayerAuthorizer(
  request: AuthorizeWsPlayerRequest
): AuthorizeWsPlayerResponse {
  const { auth } = request.query;

  if (!auth) {
    throw new MissingAuthorizationTokenError();
  }

  return {
    identity: {
      id: auth,
    },
  };
}
