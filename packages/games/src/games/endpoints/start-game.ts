import type { Service } from "@ez4/common";
import {
  type Http,
  HttpInternalServerError,
  HttpNotFoundError,
} from "@ez4/gateway";
import { GameStatus, type WhichGame } from "@games/common";
import type { PlayerIdentity } from "@/players/authorizers/types";
import { findPlayer } from "@/players/repositores/players";
import type { ApiProvider } from "@/provider";
import { showRoom, updateRoom } from "@/rooms/repositories/room";

declare class StartGameRequest implements Http.Request {
  identity: PlayerIdentity;
  parameters: {
    game: WhichGame;
  };
}

declare class StartGameResponse implements Http.Response {
  status: 204 | 404 | 500;
}

export async function startGameHandler(
  request: StartGameRequest,
  context: Service.Context<ApiProvider>
): Promise<StartGameResponse> {
  const { db } = context;
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

  if (me.is_owner === false) {
    throw new HttpInternalServerError("Only owner can start game");
  }

  //TODO - Start Logic: E.g: Sort First Player, Sort Impostors

  await updateRoom(db, { roomCode: room.code, status: GameStatus.InProgress });

  return {
    status: 204,
  };
}
