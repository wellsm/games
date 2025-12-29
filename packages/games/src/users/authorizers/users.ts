import { verifyToken } from "@clerk/backend";
import { type Http, HttpForbiddenError, type Ws } from "@ez4/gateway";
import { MissingAuthorizationTokenError } from "@/errors";

declare class ClerkWebhookRequest implements Http.AuthRequest {
  headers: {
    secret: string;
  };
}

export type UserIdentity = {
  id: string;
};

declare class AuthorizePlayerResponse implements Http.AuthResponse {
  identity: {
    id: string;
  };
}

export function clerkWebhookAuthorizer(
  request: ClerkWebhookRequest
): AuthorizePlayerResponse {
  const { secret } = request.headers;

  if (!secret || secret !== process.env.CLERK_HEADER_SECRET) {
    throw new HttpForbiddenError();
  }

  return {
    identity: {
      id: "webhook",
    },
  };
}

declare class ClerkUserRequest implements Http.AuthRequest {
  headers: {
    authorization: string;
  };
}

export async function clerkUserAuthorizer(
  request: ClerkUserRequest
): Promise<AuthorizePlayerResponse> {
  const { authorization } = request.headers;
  const [, token] = authorization.split(" ");

  if (!token) {
    throw new MissingAuthorizationTokenError();
  }

  const identity = await verifyClerkToken(token);

  return {
    identity,
  };
}

declare class ClerkWsUserRequest implements Ws.AuthRequest {
  query: {
    auth: string;
  };
}

declare class AuthorizeUserResponse implements Ws.AuthResponse {
  identity: {
    id: string;
  };
}

export async function clerkUserWsAuthorizer(
  request: ClerkWsUserRequest
): Promise<AuthorizeUserResponse> {
  const { auth } = request.query;

  if (!auth) {
    throw new MissingAuthorizationTokenError();
  }

  const identity = await verifyClerkToken(auth);

  return {
    identity,
  };
}

export const verifyClerkToken = async (token: string) => {
  const { sub } = await verifyToken(token, {
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  if (!sub) {
    throw new HttpForbiddenError();
  }

  return {
    id: sub,
  };
};
