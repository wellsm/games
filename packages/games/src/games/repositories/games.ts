import type { DbClient } from "@/database/config";
import type { GameResult, ListGamesResult } from "@/games/types";

export namespace GamesRepository {
  export async function listAll(client: DbClient): Promise<ListGamesResult> {
    const { records: games } = await client.games.findMany({
      select: {
        slug: true,
        name: true,
        description: true,
      }
    });

    return games;
  }

  export async function findBySlug(client: DbClient, slug: string): Promise<GameResult | undefined> {
    return client.games.findOne({
      select: {
        slug: true,
        name: true,
        description: true,
      },
      where: {
        slug,
      }
    });
  }
}