import { Add01Icon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { PlayerChip } from "@/components/app/player-chip";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/$game/players")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Sequência das Palavras - Jogadores",
      },
    ],
  }),
});

function RouteComponent() {
  const router = useRouter();

  return (
    <div className="mx-2">
      {/* Main Content Scroll Area */}
      <main className="flex flex-1 flex-col overflow-y-auto pt-2 pb-32">
        {/* Headline */}
        <div className="py-4">
          <h3 className="font-bold text-2xl text-gray-900 leading-tight dark:text-white">
            Quem vai jogar?
          </h3>
          <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
            Adicione os nomes dos participantes para começar a sequência.
          </p>
        </div>
        {/* Input Section */}
        <div className="mx-0.5 mb-6 flex flex-col gap-3">
          <div className="relative flex w-full items-center">
            <input
              className="form-input flex h-14 w-full rounded-full border-none bg-secondary pr-14 pl-6 font-medium text-base shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-primary"
              placeholder="Nome do Jogador"
              type="text"
            />
            <Button className="absolute right-2" size="icon">
              <HugeiconsIcon icon={Add01Icon} />
            </Button>
          </div>
        </div>
        {/* Player List Header */}
        <div className="mb-3 flex items-center justify-between px-2">
          <span className="font-bold text-gray-500 text-xs uppercase tracking-wider dark:text-gray-400">
            Jogadores (4)
          </span>
          <Button className="p-0" variant="link">
            Limpar tudo
          </Button>
        </div>
        {/* Chips Grid */}
        <div className="flex flex-wrap content-start gap-3">
          {["João", "Maria"].map((name, i) => (
            <PlayerChip index={i} key={`${name}-{i}`} name={name} />
          ))}
        </div>
        {/* Empty State hint (Hidden when populated, but good structure to have) */}
        {/* 
      <div class="flex flex-col items-center justify-center py-10 opacity-50">
          <span class="material-symbols-outlined text-4xl mb-2">groups</span>
          <p class="text-sm">Adicione pelo menos 3 jogadores</p>
      </div> 
      */}
      </main>
      {/* Sticky Footer */}
      <div className="absolute right-0 bottom-0 left-0 p-4 pt-12">
        <Button
          className="w-full"
          onClick={() => router.history.back()}
          size="xl"
        >
          <span>Concluído</span>
          <HugeiconsIcon icon={CheckmarkCircle01Icon} />
        </Button>
      </div>
    </div>
  );
}
