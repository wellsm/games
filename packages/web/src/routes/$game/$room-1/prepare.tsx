import { WhichGame } from "@games/common";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Activity, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/auth";
import { usePrepareGame, useShowRoom } from "@/services/game";

export const Route = createFileRoute("/$game/$room-1/prepare")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Sequência das Palavras - Escolha as Palavras",
      },
    ],
  }),
});

function RouteComponent() {
  const navigate = useNavigate();
  const { room: code } = Route.useParams();
  const { playerId } = useAuth();

  const showRoom = useShowRoom({
    game: WhichGame.SequenceWords,
    code,
    player: playerId ?? "",
  });

  const { mutateAsync: prepareGame } = usePrepareGame();

  const { data: room, isLoading, isError } = showRoom;

  const me = room?.players.find((p) => p.id === playerId);

  const [mode, setMode] = useState<"choosing" | "confirming">(
    me?.data?.words ? "confirming" : "choosing"
  );

  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    setWords((prev) =>
      prev.length === room?.rules?.howManyWords
        ? words
        : (me?.data?.words ?? new Array(room?.rules?.howManyWords).fill(""))
    );
  }, [me, room, words]);

  if (isLoading || !room) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return navigate({ to: "/" });
  }

  function handleWordChange(index: number, word: string) {
    setWords((prev) => prev.map((item, i) => (i === index ? word : item)));
  }

  async function submitWords() {
    await prepareGame({
      game: WhichGame.SequenceWords,
      code,
      player: me?.id ?? "",
      data: { words },
    });

    setMode("confirming");
  }

  return (
    <div className="flex h-full flex-col space-y-6 px-2">
      <Activity mode={mode === "choosing" ? "visible" : "hidden"}>
        <div className="pb-4 text-center">
          <p className="mx-auto max-w-[80%] font-normal text-base text-muted-foreground leading-relaxed">
            Insira as palavras que os outros jogadores tentarão adivinhar.
          </p>
        </div>
        <main className="flex-1 overflow-y-auto">
          <div className="space-y-6">
            {words.map((_, index) => (
              <div key={`word-field-${index.toString()}`}>
                <FieldGroup>
                  <Field
                    data-invalid={
                      words[index] !== "" && words[index]?.length < 2
                    }
                  >
                    <FieldLabel>Palavra {index + 1}</FieldLabel>
                    <Input
                      autoComplete="off"
                      className="pl-4"
                      id={`word-${index}`}
                      maxLength={20}
                      onChange={({ target }) =>
                        handleWordChange(index, target.value)
                      }
                      placeholder="Digite aqui..."
                      required
                      value={words[index]}
                    />
                    {words[index] !== "" && words[index]?.length < 2 ? (
                      <FieldError>
                        A palavra precisa ter no minimo 2 letras
                      </FieldError>
                    ) : null}
                  </Field>
                </FieldGroup>
              </div>
            ))}
          </div>
        </main>
        <div className="mx-auto w-full max-w-md shrink-0 space-y-2 px-6 pt-4">
          <Button
            className="w-full"
            disabled={
              words.filter((w) => w?.length >= 2)?.length !==
              room?.rules?.howManyWords
            }
            onClick={() => submitWords()}
            size="xl"
          >
            Escolher Palavras
          </Button>
          <Button className="w-full" size="xl" variant="ghost">
            Cancelar
          </Button>
        </div>
      </Activity>
      <Activity mode={mode === "confirming" ? "visible" : "hidden"}>
        <div className="pb-4 text-center">
          <p className="mx-auto max-w-[80%] font-normal text-base text-muted-foreground leading-relaxed">
            Você escolheu as palavras abaixo, você pode altera-las quantas vezes
            quiser antes de confirmar.
          </p>
        </div>
        <main className="flex-1 space-y-4 overflow-scroll">
          {me?.data?.words?.map((word) => (
            <div
              className="w-full rounded-full border-2 bg-secondary p-4 font-bold"
              key={word.toLowerCase()}
            >
              {word}
            </div>
          ))}
        </main>
        <div className="mx-auto w-full max-w-md shrink-0 space-y-2 px-6 pt-4">
          <Button
            className="w-full"
            onClick={() => setMode("choosing")}
            size="xl"
            variant="secondary"
          >
            Mudar Palavras
          </Button>
          <Button
            className="w-full"
            onClick={() =>
              navigate({ to: `/sequence-words/${room.code}/start` })
            }
            size="xl"
          >
            Confirmar Palavras
          </Button>
          <Button className="w-full" size="xl" variant="ghost">
            Cancelar
          </Button>
        </div>
      </Activity>
    </div>
  );
}
