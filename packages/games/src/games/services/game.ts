import {
  type Game,
  type GameLogic,
  type GamePlayParams,
  type GamePlayResult,
  type GamePrepareParams,
  type GamePrepareResult,
  type GameVerifyParams,
  type GameVerifyResult,
  ImpostorGame,
  SequenceWordsGame,
  WhichGame,
} from "@games/common";

export function listAllGames() {
  const games: Game[] = [];

  games.push({
    ...SequenceWordsGame,
  });

  games.push({
    ...ImpostorGame,
  });

  return games;
}

export function findGameBySlug(slug: WhichGame): Game | null {
  const game = listAllGames().find((g) => g.slug === slug);

  if (!game) {
    return null;
  }

  return game;
}

export function provider(game: WhichGame): GameLogic {
  switch (game) {
    case WhichGame.SequenceWords:
      return SequenceWordsGame;
    default:
      throw new Error(`Game ${game} not implemented`);
  }
}

type VerifyGameParams = GameVerifyParams & {
  game: WhichGame;
};

export function verifyGame(params: VerifyGameParams): GameVerifyResult {
  return provider(params.game).verify(params);
}

type PrepareGameParams = GamePrepareParams & {
  game: WhichGame;
};

export function prepareGame(params: PrepareGameParams): GamePrepareResult {
  return provider(params.game).prepare(params);
}

type PlayGameParams = GamePlayParams & {
  game: WhichGame;
};

export function playGame(params: PlayGameParams): GamePlayResult {
  return provider(params.game).play(params);
}
