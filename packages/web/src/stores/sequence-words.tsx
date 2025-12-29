import {
  type Player as CommonPlayer,
  type SequenceWordPlayerData,
  WhichGame,
} from "@games/common";
import { createStore } from "./game";

type Player = CommonPlayer & {
  data?: SequenceWordPlayerData;
};

export const useSequenceWords = createStore<Player>(WhichGame.SequenceWords);
