import { useUser } from "@clerk/clerk-react";
import type { Room, WhichGame } from "@games/common";
import {
  CheckIcon,
  ClockIcon,
  CrownIcon,
  HashIcon,
  Loader2Icon,
  SignatureIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSequenceWords } from "@/stores/sequence-words";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

type Props = {
  game: WhichGame;
  room: Room;
};

export function Lobby({ room }: Props) {
  const { me } = useSequenceWords();
  const { user } = useUser();

  return (
    <div className="flex h-full flex-col space-y-6 px-2">
      <main className="flex-1 space-y-4">
        <div className="mb-6 grid grid-cols-3 gap-3 px-4">
          <div className="flex flex-col items-center gap-1 rounded-xl border border-white/5 bg-surface-dark p-3 text-center shadow-sm">
            <div className="mb-1 flex size-8 items-center justify-center rounded-full bg-primary/20 text-primary">
              <HashIcon />
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
              <ClockIcon />
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
              <SignatureIcon />
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
                player.id === me?.id && "border-primary/70"
              )}
              key={player.id}
            >
              <div className="relative">
                <Avatar
                  className={cn(player.id === me?.id && "ring-2 ring-primary")}
                >
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback>{player.name.at(0)}</AvatarFallback>
                </Avatar>
                {player.is_owner ? (
                  <div className="-bottom-2 -right-2 absolute rounded-full bg-background-dark p-0.5">
                    <CrownIcon size={18} strokeWidth={2} />
                  </div>
                ) : null}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="truncate font-bold text-base text-white leading-snug">
                  {player.id === me?.id ? "Você" : player.name}
                </p>
                {player.is_owner ? (
                  <p className="truncate font-medium text-primary text-xs">
                    Anfitrião
                  </p>
                ) : null}
              </div>
              {player.data?.words?.length === room.rules?.howManyWords ? (
                <div className="flex shrink-0 items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1">
                  <CheckIcon size={18} />
                  <span className="hidden font-bold text-green-400 text-xs uppercase tracking-wide sm:block">
                    Pronto
                  </span>
                </div>
              ) : (
                <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  <Loader2Icon
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
          {me?.is_owner ? null : (
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
        {me?.is_owner ? (
          <Button
            className="w-full"
            disabled={room.players.some((p) => p.data?.words?.length !== 5)}
            size="xl"
          >
            Iniciar Jogo
          </Button>
        ) : null}
      </div>
    </div>
  );
}
