import type { Service } from "@ez4/common";
import {
  type Http,
  HttpInternalServerError,
  HttpNotFoundError,
} from "@ez4/gateway";
import type { AnyPlayerData, Room, WhichGame } from "@games/common";
import { RealtimeTriggerType } from "@/export";
import type { PlayerIdentity } from "@/players/authorizers/types";
import { findPlayer, updatePlayer } from "@/players/repositores/players";
import type { ApiProvider } from "@/provider";
import { showRoom, updateRoom } from "@/rooms/repositories/room";
import { prepareGame } from "../services/game";

declare class PrepareGameRequest implements Http.Request {
  identity: PlayerIdentity;
  parameters: {
    game: WhichGame;
  };
  body: {
    data: AnyPlayerData;
  };
}

declare class PrepareGameResponse implements Http.Response {
  status: 200 | 404 | 500;
  body: Room;
}

export async function prepareGameHandler(
  request: PrepareGameRequest,
  context: Service.Context<ApiProvider>
): Promise<PrepareGameResponse> {
  const { db, eventsQueue } = context;
  const { game } = request.parameters;
  const { identity } = request;

  const me = await findPlayer(db, { playerId: identity.id });

  if (!me) {
    throw new HttpNotFoundError("Player not found");
  }

  const room = await showRoom(db, {
    gameSlug: game,
    roomCode: me.room.code,
  });

  if (!room) {
    throw new HttpNotFoundError(`Room with code ${me.room.code} not exists`);
  }

  const { data } = request.body;

  const { error, status } = prepareGame({
    game,
    status: room.status,
    rules: room.rules,
    data,
    me,
    players: room.players,
  });

  if (error) {
    throw new HttpInternalServerError(error);
  }

  await updatePlayer(db, { playerId: me.id, status, data });
  await updateRoom(db, { roomCode: room.code, status });

  eventsQueue.sendMessage({
    trigger: RealtimeTriggerType.Rooms,
    playersIds: room.players.filter((p) => p.id !== me.id).map((p) => p.id),
  });

  return {
    status: 200,
    body: {
      ...room,
      status,
      players: room.players.map((player) => ({
        ...player,
        data: player.id === identity.id ? data : player.data,
      })),
    },
  };
}
