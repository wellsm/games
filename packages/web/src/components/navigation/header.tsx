import { UserButton } from "@clerk/clerk-react";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "@tanstack/react-router";
import { Button } from "../ui/button";

type Props = {
  canGoBack?: boolean;
  game: string;
  title: string;
};

export function Header({ canGoBack = true, game, title }: Props) {
  const router = useRouter();

  return (
    <header className="relative z-10 flex items-center justify-between bg-transparent p-4 pb-2">
      {canGoBack ? (
        <Button
          aria-label="Voltar"
          className="p-0"
          onClick={() => router.history.back()}
          size="icon"
          variant="ghost"
        >
          <HugeiconsIcon className="size-6" icon={ArrowLeft02Icon} />
        </Button>
      ) : (
        <div />
      )}
      <div className="flex-1 text-center">
        <span className="mb-0.5 block font-bold text-primary text-xs uppercase tracking-widest opacity-80">
          {game}
        </span>
        <h2 className="font-bold text-foreground text-lg leading-tight tracking-tight">
          {title}
        </h2>
      </div>
      <UserButton />
    </header>
  );
}
