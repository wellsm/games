import type { Service } from "@ez4/common";
import { type Http, HttpNotFoundError } from "@ez4/gateway";
import type { Room, WhichGame } from "@games/common";
import { RealtimeTriggerType } from "@/export";
import { findGameBySlug } from "@/games/services/game";
import { createPlayer } from "@/players/repositores/players";
import type { ApiProvider } from "@/provider";
import type { UserIdentity } from "@/users/authorizers/users";
import { joinRoom, showRoom } from "../repositories/room";

declare class JoinRoomRequest implements Http.Request {
  identity: UserIdentity;
  parameters: {
    game: WhichGame;
    room: string;
  };
  body: {
    name: string;
  };
}

declare class JoinRoomResponse implements Http.Response {
  status: 200;
  body: Room;
}

export async function joinRoomHandler(
  request: JoinRoomRequest,
  context: Service.Context<ApiProvider>
): Promise<JoinRoomResponse> {
  const { db, eventsQueue } = context;
  const { game: gameSlug } = request.parameters;

  const game = findGameBySlug(gameSlug);

  if (!game) {
    throw new HttpNotFoundError(`Game with slug '${gameSlug}' not found.`);
  }

  const { room: roomCode } = request.parameters;

  const existingRoom = await showRoom(db, { gameSlug, roomCode });

  if (!existingRoom) {
    throw new HttpNotFoundError(`Room with code ${roomCode} not exists`);
  }

  const {
    identity: { id: userId },
  } = request;

  const { name } = request.body;

  const { playerId } = await createPlayer(db, {
    userId,
    roomCode,
    name,
    isOwner: false,
    seat: 1,
  });

  await joinRoom(db, {
    code: roomCode,
  });

  const room = await showRoom(db, {
    gameSlug,
    roomCode,
    players: [playerId],
  });

  if (!room) {
    throw new HttpNotFoundError(`Room with code ${roomCode} not exists`);
  }

  eventsQueue.sendMessage({
    trigger: RealtimeTriggerType.Rooms,
    usersIds: room.players
      .filter((p) => p.user_id !== userId)
      .map((p) => p.user_id),
  });

  return {
    status: 200,
    body: room,
  };
}
