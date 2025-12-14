import type { Service } from "@ez4/common";
import { type Http, HttpNotFoundError } from "@ez4/gateway";
import type { String } from "@ez4/schema";
import { RoomRepository } from "@/rooms/repositories/room";
import type { RoomProvider } from "../provider";

declare class ListRoomRequest implements Http.Request {
	parameters: {
		game: string;
	};
}

type ListRoomResult = {
	code: string;
	status: string;
	created_at: String.DateTime;
	game: {
		name: string;
		description: string;
	};
};

declare class ListRoomResponse implements Http.Response {
	status: 200;
	body: ListRoomResult[];
}

export async function listRoomHandler(
	request: ListRoomRequest,
	context: Service.Context<RoomProvider>,
): Promise<ListRoomResponse> {
	const { db } = context;
	const { game: gameSlug } = request.parameters;

	const rooms = await RoomRepository.listRoomsByGame(db, gameSlug);

	if (rooms.length === 0) {
		throw new HttpNotFoundError(`No rooms was found for game '${gameSlug}'`);
	}

	return {
		status: 200,
		body: rooms,
	};
}
