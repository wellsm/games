import type { DynamoDbEngine } from "@ez4/aws-dynamodb/client";
import type { Client, Database, Index } from "@ez4/database";
import type { ConnectionSchema } from "@/connections/schemas/connection";

export type DynamoDbClient = Dynamo["client"];

export declare class Dynamo extends Database.Service {
  client: Client<Dynamo>;

  engine: DynamoDbEngine;

  tables: [
    Database.UseTable<{
      name: "connections";
      schema: ConnectionSchema;
      indexes: {
        external_id: Index.Primary;
        user_id: Index.Secondary;
        expire_at: Index.TTL;
      };
    }>,
  ];
}
