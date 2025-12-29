import type { createRoomHandler } from "@/rooms/endpoints/create-room";
import type { listRoomHandler } from "@/rooms/endpoints/list-rooms";
import type { showRoomHandler } from "@/rooms/endpoints/show-room";
import type { clerkUserAuthorizer } from "@/users/authorizers/users";
import type { joinRoomHandler } from "./endpoints/join-room";

export type RoomRoutes = [
  {
    name: "ListRoomsByGame";
    path: "GET /api/games/{game}/rooms";
    authorizer: typeof clerkUserAuthorizer;
    handler: typeof listRoomHandler;
    cors: true;
  },
  {
    name: "CreateRoom";
    path: "POST /api/games/{game}/rooms";
    authorizer: typeof clerkUserAuthorizer;
    handler: typeof createRoomHandler;
    cors: true;
  },
  {
    name: "ShowRoom";
    path: "GET /api/games/{game}/rooms/{room}";
    authorizer: typeof clerkUserAuthorizer;
    handler: typeof showRoomHandler;
    cors: true;
  },
  {
    name: "JoinRoom";
    path: "POST /api/games/{game}/rooms/{room}/join";
    authorizer: typeof clerkUserAuthorizer;
    handler: typeof joinRoomHandler;
    cors: true;
  },
];
