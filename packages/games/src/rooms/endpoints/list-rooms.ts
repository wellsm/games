import type { Service } from "@ez4/common";
import { type Http, HttpNotFoundError } from "@ez4/gateway";
import type { String } from "@ez4/schema";
import type { WhichGame } from "@games/common";
import type { PlayerIdentity } from "@/players/authorizers/types";
import type { RoomProvider } from "../provider";
import { listRoomsByGame } from "../repositories/room";

declare class ListRoomRequest implements Http.Request {
  identity: PlayerIdentity;
  parameters: {
    game: WhichGame;
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
  context: Service.Context<RoomProvider>
): Promise<ListRoomResponse> {
  const { db } = context;
  const { game: gameSlug } = request.parameters;
  const { identity } = request;

  const rooms = await listRoomsByGame(db, {
    gameSlug,
    playerId: identity.id,
  });

  if (rooms.length === 0) {
    throw new HttpNotFoundError(`No rooms was found for game '${gameSlug}'`);
  }

  return {
    status: 200,
    body: rooms,
  };
}
