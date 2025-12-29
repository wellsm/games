import { useAuth } from "@clerk/clerk-react";
import {
  type Game,
  GameStatus,
  type Room,
  type SequenceWordPlayerData,
  type WhichGame,
} from "@games/common";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { env } from "@/config/env";
import { queryClient } from "@/main";

const BASE_URL = `${env.VITE_API_URL}/api/games`;

function url(game: WhichGame, endpoint: string): string {
  return `${BASE_URL}/${game}/${endpoint}`;
}

export async function apiFetch<T>(
  input: RequestInfo,
  init: RequestInit = {},
  token?: string
): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message ?? "API Error");
  }

  return body;
}

type TokenParams = {
  token: string | null;
};

type CreateRoomParams<Rules> = {
  game: WhichGame;
  name: string;
  rules: Rules;
};

export async function createRoom<T>({
  game,
  name,
  rules,
  token,
}: CreateRoomParams<T> & TokenParams): Promise<Room> {
  return await apiFetch(
    url(game, "rooms"),
    {
      method: "POST",
      body: JSON.stringify({
        name,
        rules,
      }),
    },
    token ?? undefined
  );
}

export const useCreateRoom = <Rules>() => {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (params: CreateRoomParams<Rules>) =>
      createRoom<Rules>({ ...params, token: await getToken() }),
    onSuccess: (room) => {
      queryClient.setQueryData(["room", room.code], room);
    },
  });
};

type JoinRoomParams = {
  game: WhichGame;
  room: string;
  name: string;
};

export async function joinRoom({
  game,
  name,
  room,
  token,
}: JoinRoomParams & TokenParams): Promise<Room> {
  return await apiFetch(
    url(game, `rooms/${room}/join`),
    {
      method: "POST",
      body: JSON.stringify({
        name,
      }),
    },
    token ?? undefined
  );
}

export const useJoinRoom = () => {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (params: JoinRoomParams) =>
      joinRoom({ ...params, token: await getToken() }),
    onSuccess: (room) => {
      queryClient.setQueryData(["room", room.code], room);
    },
  });
};

function listGames(): Promise<Game[]> {
  return apiFetch<Game[]>(BASE_URL);
}

export const useListGames = () => {
  return useSuspenseQuery({
    queryKey: ["games"],
    queryFn: (): Promise<Game[]> => listGames(),
  });
};

type PrepareGameParams = {
  game: WhichGame;
  code: string;
  player: string;
  data: SequenceWordPlayerData;
};

export async function prepareGame({
  game,
  player,
  data,
}: PrepareGameParams): Promise<Room> {
  const response = await fetch(url(game, "prepare"), {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${player}`,
    },
    body: JSON.stringify({
      data,
    }),
  });

  return await response.json();
}

export const usePrepareGame = () => {
  return useMutation({
    mutationFn: (params: PrepareGameParams) => prepareGame(params),
    onMutate: ({ code, player, data }) => {
      try {
        queryClient.setQueryData(["room", code], (room: Room) => ({
          ...room,
          players: room.players.map((p) => ({
            ...p,
            data: p.id === player ? data : p.data,
          })),
        }));
      } catch (_) {
        // Ignore Optimistic Update
      }
    },
    onSuccess: (room) => {
      queryClient.setQueryData(["room", room.code], room);
    },
  });
};

type ShowRoomParams = {
  game: WhichGame;
  code: string;
  token?: string;
};

export async function showRoom({
  game,
  code,
  token,
}: ShowRoomParams): Promise<Room> {
  return await apiFetch(url(game, `rooms/${code}`), {}, token);
}

export const useShowRoom = ({ game, code, player }: ShowRoomParams) => {
  return useQuery({
    queryKey: ["room", code],
    queryFn: async (): Promise<Room> => showRoom({ game, code, player }),
  });
};

type StartGameParams = {
  game: WhichGame;
  code: string;
  player: string;
};

export async function startGame({
  game,
  player,
}: StartGameParams): Promise<Room> {
  const response = await fetch(url(game, "start"), {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${player}`,
    },
  });

  return await response.json();
}

export const useStartGame = () => {
  return useMutation({
    mutationFn: (params: StartGameParams) => startGame(params),
    onMutate: ({ code }) => {
      try {
        queryClient.setQueryData(["room", code], (room: Room) => ({
          ...room,
          status: GameStatus.InProgress,
        }));
      } catch (_) {
        // Ignore Optimistic Update
      }
    },
    onSuccess: (room) => {
      queryClient.setQueryData(["room", room.code], room);
    },
  });
};
