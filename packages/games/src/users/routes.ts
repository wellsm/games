import type { clerkWebhookAuthorizer } from "@/users/authorizers/users";
import type { clerkUserEventsHandler } from "@/users/endpoints/clerk-events";

export type UserRoutes = [
  {
    path: "POST /webhook/clerk/user-events";
    authorizer: typeof clerkWebhookAuthorizer;
    handler: typeof clerkUserEventsHandler;
  },
];
