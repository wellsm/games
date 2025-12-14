import type { anyPlayerAuthorizer } from "@/players/authorizers/players";
import type { createRoomHandler } from "@/rooms/endpoints/create";
import type { listRoomHandler } from "@/rooms/endpoints/list";
import type { showRoomHandler } from "@/rooms/endpoints/show";
import type { joinRoomHandler } from "./endpoints/join";

export type RoomRoutes = [
	{
		name: "ListRoomsByGame";
		path: "GET /api/games/{game}/rooms";
		authorizer: typeof anyPlayerAuthorizer;
		handler: typeof listRoomHandler;
		cors: true;
	},
	{
		name: "CreateRoom";
		path: "POST /api/games/{game}/rooms";
		handler: typeof createRoomHandler;
		cors: true;
	},
	{
		name: "ShowRoom";
		path: "GET /api/games/{game}/rooms/{room}";
		authorizer: typeof anyPlayerAuthorizer;
		handler: typeof showRoomHandler;
		cors: true;
	},
	{
		name: "JoinRoom";
		path: "POST /api/games/{game}/rooms/{room}/join";
		handler: typeof joinRoomHandler;
		cors: true;
	},
];
