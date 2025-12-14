import type { Service } from "@ez4/common";
import type { Http } from "@ez4/gateway";
import type { GameProvider } from "@/games/provider";
import { GamesRepository } from "@/games/repositories/games";
import type { ListGamesResult } from "../types";

declare class ListGamesRequest implements Http.Request {
	//
}

declare class ListGamesResponse implements Http.Response {
	status: 200;
	body: ListGamesResult;
}

export async function listGamesHandler(
	_: ListGamesRequest,
	context: Service.Context<GameProvider>,
): Promise<ListGamesResponse> {
	const { db } = context;

	const games = await GamesRepository.listAll(db);

	return {
		status: 200,
		body: games,
	};
}
