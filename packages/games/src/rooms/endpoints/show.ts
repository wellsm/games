import type { Service } from "@ez4/common";
import { type Http, HttpNotFoundError } from "@ez4/gateway";
import type { String } from "@ez4/schema";
import type { AnyGameRules, AnyPlayerData } from "@games/common";
import type { GameStatus } from "@/games/types";
import type { PlayerIdentity } from "@/players/authorizers/types";
import type { PlayerResult } from "@/players/types";
import type { RoomProvider } from "@/rooms/provider";
import { RoomRepository } from "../repositories/room";

declare class ShowRoomRequest implements Http.Request {
	identity: PlayerIdentity;
	parameters: {
		game: string;
		room: string;
	};
}

type PlayerResponse = PlayerResult & {
	data: AnyPlayerData;
};

declare class ShowRoomResponse implements Http.Response {
	status: 200;
	body: {
		code: string;
		status: GameStatus;
		rules: AnyGameRules;
		me: PlayerResponse;
		opponents?: PlayerResponse[];
		winner?: PlayerResult;
		created_at: String.DateTime;
	};
}

export async function showRoomHandler(
	request: ShowRoomRequest,
	context: Service.Context<RoomProvider>,
): Promise<ShowRoomResponse> {
	const { db } = context;
	const { identity } = request;
	const { game: gameSlug, room: roomCode } = request.parameters;

	const room = await RoomRepository.showRoom(db, {
		roomCode,
		gameSlug,
	});

	if (!room) {
		throw new HttpNotFoundError(
			`Room with code '${roomCode}' for game '${gameSlug}' not found.`,
		);
	}

	return {
		status: 200,
		body: {
			...room,
			me: room.players.find(
				(player) => player.id === identity.id,
			) as PlayerResult,
		},
	};
}
