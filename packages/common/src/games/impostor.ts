import type { GameLogic, GamePrepareResult } from "../types/config";

export type ImpostorRules = {
  howManyImpostors: number;
};

export type ImpostorPlayerData = {
  itsImpostor: boolean;
};

export type ImpostorPlay = {
  word: string;
};

export const ImpostorGame: GameLogic = {
  slug: "impostor",
  name: "Impostor",
  icon: "hat-glasses",
  description: "Descubra quem está mentindo entre nós. Confiança é perigosa.",
  available: false,
  verify() {
    return {};
  },
  prepare({ status, data }): GamePrepareResult {
    return {
      status,
      data,
    };
  },
  play({ turn, status, me, opponents }) {
    return {
      status,
      turn: turn + 1,
      players: [me, ...opponents],
    };
  },
};
