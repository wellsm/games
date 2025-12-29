import {
  createIdentifier,
  getCurrentIsoDateTime,
  getTimeToLiveHours,
} from "@games/common";
import type { DynamoDbClient } from "@/database/dynamo";
import type { RealtimeTriggerType } from "../types/triggers";

type RegisterInput = {
  connectionId: string;
  userId: string;
};

export async function registerConnection(
  client: DynamoDbClient,
  input: RegisterInput
) {
  await client.connections.upsertOne({
    insert: {
      id: createIdentifier(),
      external_id: input.connectionId,
      created_at: getCurrentIsoDateTime(),
      expire_at: getTimeToLiveHours(1),
      user_id: input.userId,
      triggers: [],
    },
    update: {
      expire_at: getTimeToLiveHours(1),
      triggers: [],
    },
    where: {
      external_id: input.connectionId,
    },
  });
}

export type UpdateInput = {
  triggers: RealtimeTriggerType[];
};

export async function updateConnection(
  client: DynamoDbClient,
  connectionId: string,
  input: UpdateInput
) {
  await client.connections.updateOne({
    data: {
      expire_at: getTimeToLiveHours(1),
      triggers: input.triggers,
    },
    where: {
      external_id: connectionId,
    },
  });
}

export type ListAllFilters = {
  trigger: RealtimeTriggerType;
  usersIds?: string[];
};

export const listAllConnections = async (
  client: DynamoDbClient,
  filters: ListAllFilters
) => {
  const { records: connections } = await client.connections.findMany({
    select: {
      external_id: true,
    },
    where: {
      user_id: { isIn: filters.usersIds ?? [] },
      triggers: {
        contains: [filters.trigger],
      },
    },
  });

  return connections.map(({ external_id }) => external_id);
};

export async function removeConnection(
  client: DynamoDbClient,
  connectionId: string
) {
  await client.connections.deleteOne({
    where: {
      external_id: connectionId,
    },
  });
}
