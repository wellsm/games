import { createIdentifier, getCurrentIsoDateTime } from "@games/common";
import type { DbClient } from "@/database/config";

export namespace PlayerRepository {
	type CreatePlayerParams = {
		roomCode: string;
		name: string;
		isOwner: boolean;
		seat: number;
	};

	type CreatePlayerResult = {
		playerId: string;
	};

	export async function createPlayer(
		client: DbClient,
		params: CreatePlayerParams,
	): Promise<CreatePlayerResult> {
		const playerId = createIdentifier();

		await client.players.insertOne({
			data: {
				id: playerId,
				name: params.name,
				room: {
					code: params.roomCode,
				},
				is_owner: params.isOwner,
				seat: params.seat,
				score: 0,
				created_at: getCurrentIsoDateTime(),
				updated_at: getCurrentIsoDateTime(),
			},
		});

		return {
			playerId,
		};
	}
}
