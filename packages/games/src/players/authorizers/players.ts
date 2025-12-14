import { MissingAuthorizationTokenError } from "./errors";
import type { AuthorizePlayerRequest, AuthorizePlayerResponse } from "./types";

export async function anyPlayerAuthorizer(
	request: AuthorizePlayerRequest,
): Promise<AuthorizePlayerResponse> {
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
