import { SignUp } from "@clerk/clerk-react";
import { createFileRoute, useSearch } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-up")({
  component: RouteComponent,
});

type Search = {
  redirect?: string;
};

function RouteComponent() {
  const { redirect }: Search = useSearch({
    strict: false,
  });

  return <SignUp fallbackRedirectUrl={redirect ?? "/games"} signInUrl="/" />;
}
