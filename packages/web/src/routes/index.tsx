import { SignIn } from "@clerk/clerk-react";
import { createFileRoute, useSearch } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

type Search = {
  redirect?: string;
};

function RouteComponent() {
  const { redirect }: Search = useSearch({
    strict: false,
  });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        fallbackRedirectUrl={redirect ?? "/games"}
        signUpUrl={`/sign-up?redirect=${redirect}`}
      />
    </div>
  );
}
