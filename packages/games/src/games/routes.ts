import type { Http } from "@ez4/gateway";
import type { listGamesHandler } from "@/games/endpoints/list-games";
import type { playTurnHandler } from "@/games/endpoints/play-turn";
import type { prepareGameHandler } from "@/games/endpoints/prepare-game";
import type { anyPlayerAuthorizer } from "@/players/authorizers/players";
import type { clerkUserAuthorizer } from "@/users/authorizers/users";
import type { startGameHandler } from "./endpoints/start-game";

export type GamesRoutes = [
  Http.UseRoute<{
    name: "ListGames";
    path: "GET /api/games";
    authorizer: typeof clerkUserAuthorizer;
    handler: typeof listGamesHandler;
    cors: true;
  }>,
  {
    name: "PrepareGame";
    path: "PATCH /api/games/{game}/prepare";
    authorizer: typeof anyPlayerAuthorizer;
    handler: typeof prepareGameHandler;
    cors: true;
  },
  {
    name: "StartGame";
    path: "PATCH /api/games/{game}/start";
    authorizer: typeof anyPlayerAuthorizer;
    handler: typeof startGameHandler;
    cors: true;
  },
  {
    name: "PlayTurn";
    path: "PATCH /api/games/{game}/play";
    authorizer: typeof anyPlayerAuthorizer;
    handler: typeof playTurnHandler;
    cors: true;
  },
];
