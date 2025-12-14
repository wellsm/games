import type { listGamesHandler } from "@/games/endpoints/list";

export type GamesRoutes = [
	{
		name: "ListGames";
		path: "GET /api/games";
		handler: typeof listGamesHandler;
		cors: true;
	},
];
