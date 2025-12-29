import type { Service } from "@ez4/common";
import { type Http, HttpNotFoundError } from "@ez4/gateway";
import type { Room, WhichGame } from "@games/common";
import type { PlayerIdentity } from "@/players/authorizers/types";
import type { RoomProvider } from "@/rooms/provider";
import { showRoom } from "@/rooms/repositories/room";
import { findUser } from "@/users/repositories/user";

declare class ShowRoomRequest implements Http.Request {
  identity: PlayerIdentity;
  parameters: {
    game: WhichGame;
    room: string;
  };
}

declare class ShowRoomResponse implements Http.Response {
  status: 200;
  body: Room;
}

export async function showRoomHandler(
  request: ShowRoomRequest,
  context: Service.Context<RoomProvider>
): Promise<ShowRoomResponse> {
  const { db } = context;
  const {
    identity: { id: userId },
  } = request;

  const user = await findUser(db, userId);

  if (!user) {
    throw new HttpNotFoundError("User not found");
  }

  const { game: gameSlug, room: roomCode } = request.parameters;

  const room = await showRoom(db, {
    roomCode,
    gameSlug,
    players: user.players
      .filter((p) => p.room_code === roomCode)
      .map((p) => p.id),
  });

  if (!room) {
    throw new HttpNotFoundError(
      `Room with code '${roomCode}' for game '${gameSlug}' not found.`
    );
  }

  return {
    status: 200,
    body: room,
  };
}
