import {
	type AnyGameRules,
	createRandomAlphanumeric,
	getCurrentIsoDateTime,
} from "@games/common";
import type { DbClient } from "@/database/config";
import { GameStatus } from "@/games/types";

export namespace RoomRepository {
	export async function listRoomsByGame(client: DbClient, gameSlug: string) {
		const { records: rooms } = await client.rooms.findMany({
			select: {
				code: true,
				status: true,
				created_at: true,
				game: {
					name: true,
					description: true,
				},
			},
			where: {
				game_slug: gameSlug,
			},
		});

		return rooms;
	}

	type CreateRoomParams = {
		gameSlug: string;
		rules: AnyGameRules;
	};

	type RoomResult = {
		code: string;
	};

	export async function createSession(
		client: DbClient,
		params: CreateRoomParams,
	): Promise<RoomResult> {
		const code = createRandomAlphanumeric();

		await client.rooms.insertOne({
			data: {
				code,
				game: {
					slug: params.gameSlug,
				},
				turn: 0,
				rules: params.rules,
				status: GameStatus.WaitingForPlayers,
				created_at: getCurrentIsoDateTime(),
				updated_at: getCurrentIsoDateTime(),
			},
		});

		return {
			code,
		};
	}

	type ShowRoomParams = {
		gameSlug: string;
		roomCode: string;
	};

	export async function showRoom(client: DbClient, params: ShowRoomParams) {
		const room = await client.rooms.findOne({
			select: {
				code: true,
				status: true,
				created_at: true,
				rules: true,
				players: {
					id: true,
					name: true,
					seat: true,
					data: true,
				},
			},
			where: {
				code: params.roomCode,
				game_slug: params.gameSlug,
			},
		});

		if (!room) {
			return null;
		}

		return room;
	}

	type JoinRoomParams = {
		code: string;
	};

	export async function joinRoom(client: DbClient, { code }: JoinRoomParams) {
		await client.rooms.updateOne({
			data: {
				status: GameStatus.Lobby,
			},
			where: { code },
		});
	}
}
