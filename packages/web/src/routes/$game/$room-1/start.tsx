import { GameStatus, WhichGame } from "@games/common";
import { RealtimeTriggerType } from "@games/games";
import {
  CheckmarkCircle01Icon,
  Clock01Icon,
  Crown03Icon,
  GridIcon,
  SignatureIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2Icon, LoaderCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth";
import { useShowRoom, useStartGame } from "@/services/game";
import { useRealtimeEvents } from "@/services/realtime";

export const Route = createFileRoute("/$game/$room-1/start")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Sequência das Palavras - Lobby",
      },
    ],
  }),
});

function RouteComponent() {
  const navigate = useNavigate();
  const { room: code } = Route.useParams();
  const { playerId } = useAuth();
  const { mutateAsync: startGame } = useStartGame();

  const showRoom = useShowRoom({
    game: WhichGame.SequenceWords,
    code,
    player: playerId ?? "",
  });

  useRealtimeEvents([RealtimeTriggerType.Rooms], {
    refresh: () => {
      showRoom.refetch();
    },
  });

  const { data: room, isLoading, isError } = showRoom;

  const me = room?.players.find((p) => p.id === playerId);

  async function handleStartGame() {
    await startGame({
      game: WhichGame.SequenceWords,
      code,
      player: playerId ?? "",
    });
  }

  if (isLoading || !room) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return navigate({ to: "/" });
  }

  if (!(room && me)) {
    return navigate({ to: "/" });
  }

  if (room.status === GameStatus.InProgress) {
    return navigate({ to: `/sequence-words/${code}/play` });
  }

  return (
    <div className="flex h-full flex-col space-y-6 px-2">
      <main className="flex-1 space-y-4">
        <div className="mb-6 grid grid-cols-3 gap-3 px-4">
          <div className="flex flex-col items-center gap-1 rounded-xl border border-white/5 bg-surface-dark p-3 text-center shadow-sm">
            <div className="mb-1 flex size-8 items-center justify-center rounded-full bg-primary/20 text-primary">
              <HugeiconsIcon icon={GridIcon} />
            </div>
            <p className="font-bold text-white text-xl leading-none tracking-tight">
              {room.code}
            </p>
            <p className="font-medium text-[10px] text-gray-400 uppercase tracking-wider">
              Sala
            </p>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-xl border border-white/5 bg-surface-dark p-3 text-center shadow-sm">
            <div className="mb-1 flex size-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
              <HugeiconsIcon icon={Clock01Icon} />
            </div>
            <p className="font-bold text-white text-xl leading-none tracking-tight">
              {room.rules?.duration}
            </p>
            <p className="font-medium text-[10px] text-gray-400 uppercase tracking-wider">
              Segundos
            </p>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-xl border border-white/5 bg-surface-dark p-3 text-center shadow-sm">
            <div className="mb-1 flex size-8 items-center justify-center rounded-full bg-orange-500/20 text-orange-400">
              <HugeiconsIcon icon={SignatureIcon} />
            </div>
            <p className="font-bold text-lg text-white leading-none tracking-tight">
              {room.rules?.howManyWords}
            </p>
            <p className="font-medium text-[10px] text-gray-400 uppercase tracking-wider">
              Palavras
            </p>
          </div>
        </div>
        <div className="mb-3 flex items-center justify-between px-5">
          <h3 className="font-bold text-lg text-white">
            Jogadores{" "}
            <span className="ml-1 font-medium text-base text-gray-500">
              ({room.players.length}/2)
            </span>
          </h3>
          <Button
            className="p-0"
            hidden={room.players.length === 2}
            variant="link"
          >
            Convidar
          </Button>
        </div>
        <div className="flex flex-col gap-3 px-4">
          {room.players.map((player) => (
            <div
              className={cn(
                "group relative flex items-center gap-4 overflow-hidden rounded-full border border-primary/40 bg-surface-dark p-3 pr-4 shadow-md",
                player.id === me.id && "border-primary/70"
              )}
              key={player.id}
            >
              <div className="relative">
                <Avatar
                  className={cn(player.id === me.id && "ring-2 ring-primary")}
                >
                  <AvatarFallback>{player.name.at(0)}</AvatarFallback>
                </Avatar>
                {player.is_owner ? (
                  <div className="-bottom-2 -right-2 absolute rounded-full bg-background-dark p-0.5">
                    <HugeiconsIcon
                      className="rounded-full bg-background p-1 text-yellow-400"
                      icon={Crown03Icon}
                      size={18}
                      strokeWidth={2}
                    />
                  </div>
                ) : null}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="truncate font-bold text-base text-white leading-snug">
                  {player.id === me.id ? "Você" : player.name}
                </p>
                {player.is_owner ? (
                  <p className="truncate font-medium text-primary text-xs">
                    Anfitrião
                  </p>
                ) : null}
              </div>
              {player.data?.words?.length === room.rules?.howManyWords ? (
                <div className="flex shrink-0 items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1">
                  <HugeiconsIcon
                    className="text-green-400"
                    icon={CheckmarkCircle01Icon}
                    size={18}
                  />
                  <span className="hidden font-bold text-green-400 text-xs uppercase tracking-wide sm:block">
                    Pronto
                  </span>
                </div>
              ) : (
                <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  <LoaderCircle
                    className="animate-spin text-gray-400"
                    size={18}
                  />
                  <span className="hidden font-bold text-gray-400 text-xs uppercase tracking-wide sm:block">
                    Aguardando
                  </span>
                </div>
              )}
            </div>
          ))}
          {me.is_owner ? null : (
            <div className="flex items-center justify-center">
              <span className="my-6 flex flex-col items-center gap-2 px-4 font-bold text-lg text-muted-foreground">
                <Loader2Icon className="animate-spin" size={24} />
                <span className="animate-pulse">
                  Aguardando Anfitrião Iniciar
                </span>
              </span>
            </div>
          )}
          {/* Empty Slot */}
          {/* <div className="flex h-[74px] cursor-pointer items-center justify-center gap-4 rounded-xl border-2 border-white/10 border-dashed p-3 transition-all hover:border-white/20 hover:bg-white/5">
            <div className="flex items-center gap-2 text-gray-500">
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span className="font-medium text-sm">Convidar Jogador</span>
            </div>
          </div> */}
        </div>
      </main>
      <div className="mx-auto w-full max-w-md shrink-0 space-y-2 px-6 pt-4">
        {me.is_owner ? (
          <Button
            className="w-full"
            disabled={room.players.some((p) => p.data?.words?.length !== 5)}
            onClick={() => handleStartGame()}
            size="xl"
          >
            Iniciar Jogo
          </Button>
        ) : null}
      </div>
    </div>
  );
}
