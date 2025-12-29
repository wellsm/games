import { GameStatus, WhichGame } from "@games/common";
import { RealtimeTriggerType } from "@games/games";
import {
  Copy01Icon,
  Share01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth";
import { useShowRoom } from "@/services/game";
import { useRealtimeEvents } from "@/services/realtime";

export const Route = createFileRoute("/$game/$room-1/waiting")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Sequência das Palavras - Convidar Jogador",
      },
    ],
  }),
});

function RouteComponent() {
  const navigate = useNavigate();
  const { room: code } = Route.useParams();
  const { playerId } = useAuth();
  const [copied, setCopied] = useState<boolean>(false);

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

  function handleCopy(roomCode: string) {
    navigator.clipboard.writeText(roomCode);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const { isLoading } = showRoom;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const { data: room, isError } = showRoom;

  if (isError || !room) {
    return navigate({ to: "/" });
  }

  const areAllWordsSetted = room.players.every(
    (p) => p.data?.words?.length === room.rules?.howManyWords
  );

  if (room.status === GameStatus.Lobby && areAllWordsSetted) {
    return navigate({ to: `/sequence-words/${room.code}/start` });
  }

  if (room.status === GameStatus.Lobby) {
    return navigate({ to: `/sequence-words/${room.code}/prepare` });
  }

  return (
    <div className="flex h-full flex-col px-2">
      <main className="no-scrollbar mx-auto flex w-full max-w-md flex-1 flex-col items-center overflow-y-auto px-6 pt-4 pb-8">
        <div className="mt-2 mb-8 flex w-full justify-center">
          <div className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-xl backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
            <div className="relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-lg bg-white">
              <QRCodeSVG
                level="H"
                value={`${location.origin}/${WhichGame.SequenceWords}?code=${room.code}`}
              />
            </div>
            <div className="-top-1 -left-1 absolute h-6 w-6 rounded-tl-lg border-primary border-t-4 border-l-4" />
            <div className="-top-1 -right-1 absolute h-6 w-6 rounded-tr-lg border-primary border-t-4 border-r-4" />
            <div className="-bottom-1 -left-1 absolute h-6 w-6 rounded-bl-lg border-primary border-b-4 border-l-4" />
            <div className="-bottom-1 -right-1 absolute h-6 w-6 rounded-br-lg border-primary border-r-4 border-b-4" />
          </div>
        </div>
        <div className="w-full space-y-4 text-center">
          <p className="font-medium text-slate-500 text-xs uppercase tracking-widest dark:text-slate-400">
            Código da Sala
          </p>
          <Button
            className="relative h-18 w-full rounded-md border-3 border-primary/40"
            onClick={() => handleCopy(room.code)}
            size="xl"
            variant="secondary"
          >
            <span className="font-bold font-mono text-4xl text-primary tracking-[0.15em] drop-shadow-sm dark:text-white">
              {room.code}
            </span>
            <span className="absolute right-4 text-primary transition-all duration-300">
              {copied ? (
                <HugeiconsIcon icon={Tick02Icon} size={32} />
              ) : (
                <HugeiconsIcon icon={Copy01Icon} size={32} />
              )}
            </span>
          </Button>
        </div>
        <Loader2Icon className="my-6 animate-spin" size={32} />
        <div className="text-center">
          <p className="mx-auto max-w-70 font-normal text-base text-muted-foreground leading-relaxed">
            Compartilhe este código com seus amigo para que eles entre na sala.
          </p>
        </div>
      </main>
      <div className="mx-auto w-full max-w-md shrink-0 space-y-2 px-6">
        <Button className="w-full" size="xl">
          <HugeiconsIcon icon={Share01Icon} />
          Compartilhar Código
        </Button>
        <Button className="w-full" size="xl" variant="ghost">
          Cancelar
        </Button>
      </div>
    </div>
  );
}
