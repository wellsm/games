import type { Service } from "@ez4/common";
import { type Http, HttpNotFoundError } from "@ez4/gateway";
import type { AnyGameRules, Room, WhichGame } from "@games/common";
import { findGameBySlug } from "@/games/services/game";
import { createPlayer } from "@/players/repositores/players";
import type { ApiProvider } from "@/provider";
import { createSession, showRoom } from "@/rooms/repositories/room";
import type { UserIdentity } from "@/users/authorizers/users";

declare class CreateRoomRequest implements Http.Request {
  identity: UserIdentity;
  parameters: {
    game: WhichGame;
  };
  body: {
    name: string;
    rules: AnyGameRules;
  };
}

declare class CreateRoomResponse implements Http.Response {
  status: 200;
  body: Room;
}

export async function createRoomHandler(
  request: CreateRoomRequest,
  context: Service.Context<ApiProvider>
): Promise<CreateRoomResponse> {
  const { game: gameSlug } = request.parameters;

  const game = findGameBySlug(gameSlug);

  if (!game) {
    throw new HttpNotFoundError(`Game with slug '${gameSlug}' not found.`);
  }

  const {
    identity: { id: userId },
  } = request;
  const { db } = context;
  const { name, rules } = request.body;

  const { code: roomCode } = await createSession(db, {
    gameSlug,
    rules,
  });

  const { playerId } = await createPlayer(db, {
    userId,
    roomCode,
    name,
    isOwner: true,
    seat: 0,
  });

  const room = await showRoom(db, {
    gameSlug,
    roomCode,
    players: [playerId],
  });

  if (!room) {
    throw new HttpNotFoundError("Room not found.");
  }

  return {
    status: 200,
    body: room,
  };
}
