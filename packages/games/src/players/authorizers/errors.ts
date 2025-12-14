export class MissingAuthorizationTokenError extends Error {
	constructor() {
		super("Missing authorization token header.");
	}
}
