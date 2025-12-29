import type { Environment } from "@ez4/common";
import type { Client, Database, Index } from "@ez4/database";
import type { PostgresEngine } from "@ez4/raw-pg/client";
import type { PlayerSchema } from "@/players/schemas/player";
import type { RoomSchema } from "@/rooms/schemas/room";
import type { UserSchema } from "@/users/schemas/user";

export type DbClient = Db["client"];

export declare class Db extends Database.Service {
  client: Client<typeof this>;

  engine: PostgresEngine;

  scalability: {
    minCapacity: Environment.VariableOrValue<"DATABASE_MIN_CAPACITY", 0>;
    maxCapacity: Environment.VariableOrValue<"DATABASE_MAX_CAPACITY", 2>;
  };

  tables: [
    {
      name: "users";
      schema: UserSchema;
      relations: {
        "id@players": "players:user_id";
      };
      indexes: {
        id: Index.Primary;
        status: Index.Secondary;
      };
    },
    {
      name: "rooms";
      schema: RoomSchema;
      relations: {
        "code@players": "players:room_code";
      };
      indexes: {
        code: Index.Primary;
      };
    },
    {
      name: "players";
      schema: PlayerSchema;
      relations: {
        "room_code@room": "rooms:code";
        "user_id@user": "users:id";
      };
      indexes: {
        id: Index.Primary;
        room_code: Index.Secondary;
      };
    },
  ];
}
