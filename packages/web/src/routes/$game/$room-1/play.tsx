import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$game/$room-1/play")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello Play</div>;
}
