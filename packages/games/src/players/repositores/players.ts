import type { String } from "@ez4/schema";
import {
  type AnyPlayerData,
  createIdentifier,
  type GameStatus,
  getCurrentIsoDateTime,
} from "@games/common";
import type { DbClient } from "@/database/postgres";

type CreatePlayerParams = {
  roomCode: string;
  name: string;
  isOwner: boolean;
  seat: number;
  userId: string;
};

type CreatePlayerResult = {
  playerId: string;
};

export async function createPlayer(
  client: DbClient,
  params: CreatePlayerParams
): Promise<CreatePlayerResult> {
  const playerId = createIdentifier();

  await client.players.insertOne({
    data: {
      id: playerId,
      user: {
        id: params.userId,
      },
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

type FindPlayerParams = {
  playerId: string;
};

export async function findPlayer(client: DbClient, params: FindPlayerParams) {
  const player = await client.players.findOne({
    select: {
      id: true,
      is_owner: true,
      room: {
        code: true,
      },
      name: true,
      seat: true,
      data: true,
    },
    where: {
      id: params.playerId,
    },
  });

  if (!player) {
    return null;
  }

  return player;
}

type UpdatePlayerParams = {
  playerId: String.UUID;
  status: GameStatus;
  data?: AnyPlayerData;
};

export async function updatePlayer(
  client: DbClient,
  params: UpdatePlayerParams
) {
  return await client.players.updateOne({
    data: {
      data: params.data,
      room: {
        status: params.status,
      },
      updated_at: getCurrentIsoDateTime(),
    },
    where: {
      id: params.playerId,
    },
  });
}
