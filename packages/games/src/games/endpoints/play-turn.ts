import type { Service } from "@ez4/common";
import {
  type Http,
  HttpInternalServerError,
  HttpNotFoundError,
} from "@ez4/gateway";
import type { AnyPlay, WhichGame } from "@games/common";
import type { PlayerIdentity } from "@/players/authorizers/types";
import { findPlayer } from "@/players/repositores/players";
import type { ApiProvider } from "@/provider";
import { showRoom, updateRoom } from "@/rooms/repositories/room";
import { playGame, verifyGame } from "../services/game";

declare class PlayTurnRequest implements Http.Request {
  identity: PlayerIdentity;
  parameters: {
    game: WhichGame;
  };
  body: {
    data: AnyPlay;
  };
}

declare class PlayTurnResponse implements Http.Response {
  status: 200 | 404 | 500;
  body: {
    code: string;
    me: string;
  };
}

export async function playTurnHandler(
  request: PlayTurnRequest,
  context: Service.Context<ApiProvider>
): Promise<PlayTurnResponse> {
  const { db } = context;
  const { game: gameSlug } = request.parameters;
  const { identity } = request;

  const me = await findPlayer(db, { playerId: identity.id });

  if (!me) {
    throw new HttpNotFoundError("Player not found");
  }

  const room = await showRoom(db, {
    gameSlug,
    roomCode: me.room.code,
  });

  if (!room) {
    throw new HttpNotFoundError(`Room with code ${me.room.code} not exists`);
  }

  const { error: verifyError } = verifyGame({
    game: gameSlug,
    players: room.players,
    me,
    turn: room.turn,
  });

  if (verifyError) {
    throw new HttpInternalServerError(verifyError);
  }

  const { data } = request.body;

  const {
    error: playError,
    turn,
    status,
    winner,
    players,
  } = playGame({
    game: gameSlug,
    me,
    status: room.status,
    turn: room.turn,
    play: data,
    opponents: room.players.filter((p) => p.id !== me.id),
  });

  if (playError) {
    throw new HttpInternalServerError(playError);
  }

  for (const player of players) {
    console.log(player);
  }

  await updateRoom(db, {
    roomCode: room.code,
    turn,
    winner: winner?.id,
    status,
  });

  return {
    status: 200,
    body: {
      code: room.code,
      me: gameSlug,
    },
  };
}
