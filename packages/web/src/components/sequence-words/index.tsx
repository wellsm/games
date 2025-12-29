import type { WhichGame } from "@games/common";
import {
  ChevronRightIcon,
  DoorClosedIcon,
  Gamepad2Icon,
  PlusIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Separator } from "../ui/separator";
import { CreateRoom } from "./create-room";
import { JoinRoom } from "./join-room";

type Props = {
  game: WhichGame;
  code?: string;
};

export function SequenceWordsIndex({ game, code }: Props) {
  return (
    <>
      {/* Headline */}
      <div className="mb-6 text-center">
        <div className="mb-4 inline-flex size-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
          <Gamepad2Icon size={32} />
        </div>
        <h1 className="mb-2 font-bold text-[32px] text-white leading-tight tracking-tight">
          Como deseja jogar?
        </h1>
        <p className="font-normal text-base text-white/60">
          Crie uma nova partida ou junte-se aos seus amigos.
        </p>
      </div>
      {/* Create Game Action (Primary Path) */}
      <div className="flex flex-col gap-4 px-6">
        <Drawer>
          <DrawerTrigger asChild>
            <Button className="group relative flex h-14 w-full cursor-pointer items-center justify-between overflow-hidden rounded-full bg-primary px-2 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-primary/40 active:scale-[0.98]">
              <div className="flex items-center gap-4 pl-6">
                <PlusIcon size={32} />
                <div className="flex flex-col items-start text-left">
                  <span className="font-bold text-lg leading-tight">
                    Criar Novo Jogo
                  </span>
                  <span className="font-medium text-white/80 text-xs uppercase tracking-wider">
                    Seja o anfitrião
                  </span>
                </div>
              </div>
              <div className="mr-2">
                <ChevronRightIcon size={32} />
              </div>
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle className="font-bold text-lg">
                  Criação da Sala
                </DrawerTitle>
                <DrawerDescription className="text-base">
                  Defina as regras e informe seu nome para jogar
                </DrawerDescription>
              </DrawerHeader>
              <CreateRoom game={game} />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      <Separator className="my-8" text="OU" />
      {/* Join Game Section (Form Card) */}
      <div className="glass-panel flex flex-col gap-5 rounded-2xl px-6">
        <div className="mb-1 flex items-center gap-3">
          <DoorClosedIcon size={28} />
          <h3 className="font-bold text-lg text-white">Entrar em uma sala</h3>
        </div>
        <JoinRoom code={code} />
      </div>
    </>
  );
}
