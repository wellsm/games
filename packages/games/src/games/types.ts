export enum GameStatus {
	WaitingForPlayers = "waiting-for-players",
	Lobby = "lobby",
	InProgress = "in-progress",
	Finished = "finished",
	Canceled = "canceled",
}

export type GameResult = {
	slug: string;
	name: string;
	description: string;
};

export type ListGamesResult = GameResult[];
