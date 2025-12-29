import type { String } from "@ez4/schema";
import type {
  SequenceWordPlay,
  SequenceWordPlayerData,
  SequenceWordRules,
} from "../games/sequence-words";

export type GameConfig<Rules, PlayerData> = {
  rules: Rules;
  players: Record<String.UUID, PlayerData>;
};

export type AnyGameRules = SequenceWordRules;

export const DEFAULT_RULES: AnyGameRules = {
  howManyWords: 5,
  duration: 30,
};

export type AnyPlayerData = SequenceWordPlayerData;
export type AnyPlay = SequenceWordPlay;

export const DEFAULT_PLAYER_DATA: AnyPlayerData = {};

export const enum WhichGame {
  SequenceWords = "sequence-words",
}

export const enum GameStatus {
  WaitingForPlayers = "waiting-for-players",
  Lobby = "lobby",
  Ready = "ready",
  InProgress = "in-progress",
  Finished = "finished",
  Canceled = "canceled",
}

export type Game = Pick<
  GameLogic,
  "name" | "slug" | "icon" | "description" | "available"
>;

export type Room = {
  code: string;
  game: WhichGame;
  status: GameStatus;
  rules?: AnyGameRules;
  players: Player[];
  turn?: number;
  created_at?: string;
  updated_at?: string;
};

export type Player = {
  id: string;
  name: string;
  seat: number;
  is_owner: boolean;
  data?: AnyPlayerData;
};

export type GameVerifyParams = {
  players: Pick<Player, "id">[];
  turn: number;
  me: Player;
};

export type GameVerifyResult = {
  error?: string;
};

export type GamePrepareParams = {
  rules?: AnyGameRules;
  status: GameStatus;
  data?: AnyPlayerData;
  me: Player;
  players: Player[];
};

export type GamePrepareResult = {
  error?: string;
  data?: AnyPlayerData;
  status: GameStatus;
};

export type GamePlayParams = {
  turn: number;
  status: GameStatus;
  me: Player;
  opponents: Player[];
  play: AnyPlay;
};

export type GamePlayResult = {
  error?: string;
  turn: number;
  players: Player[];
  winner?: Player;
  status: GameStatus;
};

export type GameLogic = {
  slug: string;
  name: string;
  icon?: string;
  description: string;
  available: boolean;
  verify(params: GameVerifyParams): GameVerifyResult;
  prepare(params: GamePrepareParams): GamePrepareResult;
  play(params: GamePlayParams): GamePlayResult;
};
