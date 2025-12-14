import type { Service } from "@ez4/common";
import { type Http, HttpNotFoundError } from "@ez4/gateway";
import { GamesRepository } from "@/games/repositories/games";
import { PlayerRepository } from "@/players/repositores/players";
import type { RoomProvider } from "@/rooms/provider";
import { RoomRepository } from "@/rooms/repositories/room";

declare class JoinRoomRequest implements Http.Request {
	parameters: {
		game: string;
		room: string;
	};
	body: {
		name: string;
	};
}

type JoinRoomResult = {
	playerId: string;
};

declare class JoinRoomResponse implements Http.Response {
	status: 200;
	body: JoinRoomResult;
}

export async function joinRoomHandler(
	request: JoinRoomRequest,
	context: Service.Context<RoomProvider>,
): Promise<JoinRoomResponse> {
	const { db } = context;
	const { game: gameSlug } = request.parameters;

	const game = await GamesRepository.findBySlug(db, gameSlug);

	if (!game) {
		throw new HttpNotFoundError(`Game with slug '${gameSlug}' not found.`);
	}

	const { room: roomCode } = request.parameters;

	const room = await RoomRepository.showRoom(db, { gameSlug, roomCode });

	if (!room) {
		throw new HttpNotFoundError(`Room with code ${roomCode} not exists`);
	}

	const { name } = request.body;

	const { playerId } = await PlayerRepository.createPlayer(db, {
		roomCode,
		name,
		isOwner: false,
		seat: 1,
	});

	await RoomRepository.joinRoom(db, {
		code: roomCode,
	});

	return {
		status: 200,
		body: {
			playerId,
		},
	};
}
