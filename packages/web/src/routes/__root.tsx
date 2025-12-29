import { SignedIn, type useAuth } from "@clerk/clerk-react";
import {
  createRootRouteWithContext,
  Outlet,
  useMatches,
  useRouterState,
} from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import { Header } from "@/components/navigation/header";

interface RootRouteContext {
  auth?: ReturnType<typeof useAuth>;
}

export const Route = createRootRouteWithContext<RootRouteContext>()({
  component: RootComponent,
});

const DEFAULT_TITLE = " - Escolha o Jogo";

function GlobalLoader() {
  const isLoading = useRouterState({
    select: (s) => s.status === "pending",
  });

  if (!isLoading) {
    return null;
  }

  return (
    <div className="z-1 flex h-screen items-center justify-center">
      <Loader2Icon className="animate-spin" size={32} />
    </div>
  );
}

function RootComponent() {
  const matches = useMatches();

  const match = matches.filter((m) => m.meta).shift();
  const meta = match?.meta?.find((m) => m?.title)?.title ?? DEFAULT_TITLE;

  const parts = meta.split("-").map((m) => m.trim());
  const game = parts.shift()?.trim() ?? "";
  const title = parts.pop() ?? "";

  return (
    <>
      <GlobalLoader />
      <div className="flex h-screen flex-col">
        <SignedIn>
          <Header canGoBack={matches.length === 3} game={game} title={title} />
        </SignedIn>
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>
    </>
  );
}
