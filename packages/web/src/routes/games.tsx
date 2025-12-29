import { listAllGames } from "@games/common";
import { createFileRoute } from "@tanstack/react-router";
import { Game } from "@/components/app/game";
import type { IconName } from "@/components/app/icon";

export const Route = createFileRoute("/games")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Games - Escolha o Jogo",
      },
    ],
  }),
});

function RouteComponent() {
  const games = listAllGames();

  return (
    <main className="flex flex-col gap-6">
      {games.map((game) => (
        <Game
          available={game.available}
          description={game.description}
          icon={game.icon as IconName}
          key={game.slug}
          slug={game.slug}
          title={game.name}
        />
      ))}
    </main>
  );
}
