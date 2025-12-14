import { Room } from "@ez4/gateway";
import { HTTPError, HTTPResponse } from "@ez4/local-gateway";
import { z } from "zod";
import { GameProvider } from "../../../games/provider";
import { PlayerRepository } from "../../../players/repositores/players";
import { RoomRepository } from "../../repositories/room";

export const playInRoomInput = z.object({
  playData: z.any(),
});

export type PlayInRoomInput = z.infer<typeof playInRoomInput>;

export const playInRoomHandler =
  ({
    gameProvider,
    playerRepository,
    roomRepository,
  }: {
    gameProvider: GameProvider;
    playerRepository: PlayerRepository;
    roomRepository: RoomRepository;
  }) =>
  async (
    req: {
      body: PlayInRoomInput;
      params: { game: string; room: string };
    },
    ctx: { player: { id: string } }
  ): Promise<HTTPResponse<Room>> => {
    const {
      params: { game: gameSlug, room: roomSlug },
      body: { playData },
    } = req;
    const {
      player: { id: playerId },
    } = ctx;

    const room = await roomRepository.findBySlug(roomSlug);
    if (!room) {
      throw new HTTPError(404, "Room not found");
    }

    const player = await playerRepository.findById(playerId);
    if (!player) {
      throw new HTTPError(404, "Player not found");
    }

    const game = gameProvider.get(gameSlug);
    if (!game) {
      throw new HTTPError(404, "Game not found");
    }

    if (room.status !== "playing") {
      throw new HTTPError(400, "Game is not in playing status");
    }

    if (room.currentTurn !== player.id) {
      throw new HTTPError(403, "It's not your turn");
    }

    const { nextTurn, customData, winner } = await game.play({
      room,
      player,
      playData,
    });

    const updatedPlayer = await playerRepository.update(player.id, {
      customData,
    });

    if (winner) {
      await roomRepository.update(room.id, {
        status: "finished",
        winnerId: winner.id,
      });
    } else if (nextTurn) {
      await roomRepository.update(room.id, {
        currentTurn: nextTurn,
      });
    }

    const updatedRoom = await roomRepository.findBySlug(roomSlug);
    if (!updatedRoom) {
      throw new HTTPError(404, "Room not found");
    }

    return new HTTPResponse(200, updatedRoom);
  };
