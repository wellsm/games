import type { String } from "@ez4/schema";
import type { DbClient } from "@/database/postgres";
import { UserStatus } from "@/users/types";

export async function findUser(db: DbClient, id: string) {
  return await db.users.findOne({
    select: {
      id: true,
      players: {
        id: true,
        room_code: true,
      },
    },
    where: {
      id,
    },
  });
}

type UpsertUserParams = {
  id: string;
  name: string;
  email?: string;
  external_id?: string;
  avatar?: string;
  status: UserStatus;
  created_at: String.DateTime;
  updated_at: String.DateTime;
  deleted_at?: String.DateTime;
};

export async function upsertUser(db: DbClient, params: UpsertUserParams) {
  await db.users.upsertOne({
    insert: params,
    update: {
      status: params.status,
      name: params.name,
      email: params.email,
      avatar: params.avatar,
      updated_at: params.updated_at,
      deleted_at: params.deleted_at,
    },
    where: {
      id: params.id,
    },
  });
}

type DeleteUserParams = {
  id: string;
  deleted_at?: String.DateTime;
};

export async function deleteUser(db: DbClient, params: DeleteUserParams) {
  await db.users.updateOne({
    data: {
      deleted_at: params.deleted_at,
      status: UserStatus.Disabled,
    },
    where: {
      id: params.id,
    },
  });
}
