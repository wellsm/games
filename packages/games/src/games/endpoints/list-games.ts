import type { Http } from "@ez4/gateway";
import { listAllGames } from "@games/common";

declare class ListGamesRequest implements Http.Request {
  //
}

export type GameResult = {
  slug: string;
  name: string;
  description: string;
  available: boolean;
};

type ListGamesResult = GameResult[];

declare class ListGamesResponse implements Http.Response {
  status: 200;
  body: ListGamesResult;
}

export function listGamesHandler(_: ListGamesRequest): ListGamesResponse {
  const games = listAllGames();

  return {
    status: 200,
    body: games,
  };
}
