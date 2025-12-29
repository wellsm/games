import { findGameBySlug, WhichGame } from "@games/common";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { SequenceWordsIndex } from "@/components/sequence-words";

type Search = {
  code?: string;
};

export const Route = createFileRoute("/$game/")({
  component: RouteComponent,
  head: ({ params }) => {
    const game = findGameBySlug(params.game as WhichGame);

    return {
      meta: [
        {
          title: `${game?.name} - Jogo`,
        },
      ],
    };
  },
});

function RouteComponent() {
  const { code }: Search = useSearch({
    strict: false,
  });

  const { game } = Route.useParams();

  return (
    <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col">
      {game === WhichGame.SequenceWords ? (
        <SequenceWordsIndex code={code} game={game} />
      ) : null}
    </main>
  );
}
