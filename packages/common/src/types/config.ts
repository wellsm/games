import type { String } from "@ez4/schema";
import type {
	SequenceWordPlayerData,
	SequenceWordRules,
} from "@games/sequence-words";

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

export const DEFAULT_PLAYER_DATA: AnyPlayerData = {
	wordIndex: 0,
	revealedLetters: 1,
};
