import {
  type GameLogic,
  type GamePrepareResult,
  GameStatus,
} from "../types/config";

export type SequenceWordRules = {
  howManyWords: number;
  duration: number;
};

export type SequenceWordPlayerData = {
  words?: string[];
  currentIndex?: number;
  revealed?: number;
};

export type SequenceWordPlay = {
  word: string;
};

export const SequenceWordsGame: GameLogic = {
  slug: "sequence-words",
  name: "Sequência das Palavras",
  icon: "signature",
  description: "Teste seu vocabulário e agilidade mental neste desafio rápido.",
  available: true,
  verify({ me, players, turn }) {
    if (turn % players.length !== me.seat) {
      return {
        error: "Its not your turn",
      };
    }

    return {};
  },
  prepare({ status, rules, data, me, players }): GamePrepareResult {
    if (rules?.howManyWords !== data?.words?.length) {
      return {
        error: `You need to provide ${rules?.howManyWords} words`,
        status,
        data: undefined,
      };
    }

    //TODO - Verify: Every words must have at least 2 letters

    const isOtherPlayersReady = players
      .filter((p) => p.id !== me.id)
      .every((p) => p?.data?.words?.length === rules?.howManyWords);

    return {
      status: isOtherPlayersReady ? GameStatus.Ready : status,
      data,
    };
  },
  play({ turn, status, me, opponents, play }) {
    const opponent = opponents.shift();
    const result = {
      turn,
      status,
      players: [me, ...opponents],
    };

    if (!opponent) {
      return {
        ...result,
        error: "Opponents not setted",
      };
    }

    if (!opponent.data?.words || opponent?.data?.words?.length === 0) {
      return {
        ...result,
        error: "Your opponent doesn't set his words",
      };
    }

    const currentIndex = opponent?.data?.currentIndex ?? 1;
    const revealed = opponent?.data?.revealed ?? 1;
    const word = opponent.data.words[currentIndex] ?? "";

    if (play.word === word) {
      const newIndex = currentIndex + 1;
      const itsLastWord = newIndex === opponent.data.words.length;

      return {
        ...result,
        status: GameStatus.Finished,
        winner: itsLastWord ? me : undefined,
        players: [
          me,
          {
            ...opponent,
            data: {
              ...opponent.data,
              currentIndex: itsLastWord ? currentIndex : newIndex,
              revealed: 1,
            },
          },
        ],
      };
    }

    return {
      ...result,
      turn: turn + 1,
      players: [
        me,
        {
          ...opponent,
          data: {
            ...opponent.data,
            currentIndex,
            revealed: Math.min(word.length, revealed + 1),
          },
        },
      ],
    };
  },
};
