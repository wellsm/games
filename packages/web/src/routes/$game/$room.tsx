import { findGameBySlug, GameStatus, type WhichGame } from "@games/common";
import { RealtimeTriggerType } from "@games/games";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Lobby } from "@/components/games/lobby";
import { WaitingForPlayers } from "@/components/games/waiting-for-players";
import { showRoom } from "@/services/game";
import { useRealtimeEvents } from "@/services/realtime";

export const Route = createFileRoute("/$game/$room")({
  component: RouteComponent,
  loader: async ({ params: { game, room: code }, context }) => {
    const token = await context.auth?.getToken();

    if (!token) {
      throw redirect({
        to: "/",
        search: {
          redirect: location.href,
        },
      });
    }

    const room = await showRoom({
      game: game as WhichGame,
      code,
      token: token ?? undefined,
    });

    return { room };
  },
  pendingComponent: () => <div className="h-screen">Loading...</div>,
  head: ({ loaderData, params: { game: gameSlug } }) => {
    const game = findGameBySlug(gameSlug as WhichGame);
    const room = loaderData?.room;

    let state = "Jogo";

    if (room?.status === GameStatus.WaitingForPlayers) {
      state = "Aguardando Jogadores";
    }

    if (room?.status === GameStatus.Lobby) {
      state = "Sala";
    }

    if (room?.status === GameStatus.Ready) {
      state = "Pronto para Iniciar";
    }

    return {
      meta: [
        {
          title: `${game?.name} - ${state}`,
        },
      ],
    };
  },
});

function RouteComponent() {
  const { room } = Route.useLoaderData();
  const { game } = Route.useParams();

  useRealtimeEvents([RealtimeTriggerType.Rooms], {
    refresh: () => {
      location.reload();
    },
  });

  if (!room) {
    return null;
  }

  switch (room.status) {
    case GameStatus.WaitingForPlayers:
      return <WaitingForPlayers game={game as WhichGame} room={room} />;
    case GameStatus.Lobby:
      return <Lobby game={game as WhichGame} room={room} />;
    default:
      return null;
  }
}
