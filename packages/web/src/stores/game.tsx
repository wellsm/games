import { create, type StoreApi, type UseBoundStore } from "zustand";
import { persist } from "zustand/middleware";

export type GameMode = "offline" | "online";

export type Game<P> = {
  mode: GameMode;
  setMode: (mode: GameMode) => void;
  me?: P;
  setMe: (me: P) => void;
};

export function createStore<P>(name: string): UseBoundStore<StoreApi<Game<P>>> {
  return create<Game<P>>()(
    persist(
      (set) => ({
        mode: "offline",
        setMode: (mode: GameMode) => set({ mode }),
        setMe: (me: P) => set({ me }),
      }),
      {
        name,
      }
    )
  );
}
