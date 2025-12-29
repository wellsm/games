import "./index.css";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ptBR } from "@clerk/localizations";
import { dark } from "@clerk/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { env } from "@/config/env";
import { ThemeProvider } from "./components/providers/theme";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

export const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: {
    auth: undefined,
    queryClient,
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  const auth = useAuth();

  return <RouterProvider context={{ auth }} router={router} />;
}

// biome-ignore lint/style/noNonNullAssertion: Annoying
const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="games-theme">
        <ClerkProvider
          afterSignOutUrl="/"
          appearance={{
            theme: dark,
          }}
          localization={ptBR}
          publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY}
        >
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </ClerkProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
