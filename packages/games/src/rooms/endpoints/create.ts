import type { Service } from "@ez4/common";
import { type Http, HttpNotFoundError } from "@ez4/gateway";
import type { AnyGameRules } from "@games/common";
import type { GameProvider } from "@/games/provider";
import { GamesRepository } from "@/games/repositories/games";
import { PlayerRepository } from "@/players/repositores/players";
import { RoomRepository } from "@/rooms/repositories/room";

declare class CreateRoomRequest implements Http.Request {
	parameters: {
		game: string;
	};
	body: {
		name: string;
		rules: AnyGameRules;
	};
}

type CreateRoomResult = {
	code: string;
	playerId: string;
};

declare class CreateRoomResponse implements Http.Response {
	status: 200;
	body: CreateRoomResult;
}

export async function createRoomHandler(
	request: CreateRoomRequest,
	context: Service.Context<GameProvider>,
): Promise<CreateRoomResponse> {
	const { db } = context;
	const { game: gameSlug } = request.parameters;

	const game = await GamesRepository.findBySlug(db, gameSlug);

	if (!game) {
		throw new HttpNotFoundError(`Game with slug '${gameSlug}' not found.`);
	}

	const { name, rules } = request.body;

	const { code: roomCode } = await RoomRepository.createSession(db, {
		gameSlug,
		rules,
	});

	const { playerId } = await PlayerRepository.createPlayer(db, {
		roomCode,
		name,
		isOwner: true,
		seat: 0,
	});

	return {
		status: 200,
		body: {
			code,
			playerId,
		},
	};
}
