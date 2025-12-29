import type { String } from "@ez4/schema";
import {
  type AnyGameRules,
  createRandomAlphanumeric,
  GameStatus,
  getCurrentIsoDateTime,
  type WhichGame,
} from "@games/common";
import type { DbClient } from "@/database/postgres";

type ListRoomsByGameParams = {
  gameSlug: WhichGame;
  playerId: String.UUID;
};

export async function listRoomsByGame(
  client: DbClient,
  params: ListRoomsByGameParams
) {
  const { records: rooms } = await client.rooms.findMany({
    select: {
      code: true,
      status: true,
      created_at: true,
      game: true,
    },
    where: {
      game: params.gameSlug,
      players: {
        id: { isIn: [params.playerId] },
      },
    },
  });

  return rooms;
}

type CreateRoomParams = {
  gameSlug: WhichGame;
  rules: AnyGameRules;
};

type RoomResult = {
  code: string;
};

export async function createSession(
  client: DbClient,
  params: CreateRoomParams
): Promise<RoomResult> {
  const code = createRandomAlphanumeric();

  await client.rooms.insertOne({
    data: {
      code,
      game: params.gameSlug,
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
  gameSlug: WhichGame;
  roomCode: string;
  players?: String.UUID[];
};

export async function showRoom(client: DbClient, params: ShowRoomParams) {
  const room = await client.rooms.findOne({
    select: {
      code: true,
      game: true,
      status: true,
      created_at: true,
      rules: true,
      turn: true,
      players: {
        id: true,
        name: true,
        seat: true,
        data: true,
        is_owner: true,
        user_id: true,
      },
    },
    where: {
      code: params.roomCode,
      game: params.gameSlug,
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

type UpdateRoomParams = {
  roomCode: string;
  status?: GameStatus;
  winner?: String.UUID;
  turn?: number;
};

export async function updateRoom(client: DbClient, params: UpdateRoomParams) {
  return await client.rooms.updateOne({
    data: {
      ...params,
      updated_at: getCurrentIsoDateTime(),
    },
    where: {
      code: params.roomCode,
    },
  });
}
