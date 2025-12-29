import { DatabaseRunner } from "@ez4/local-database/run";
import { getCurrentIsoDateTime } from "@games/common";
import type { Db } from "@/database/postgres";

const client = DatabaseRunner.getClient<Db>("db");
const now = getCurrentIsoDateTime();

await client.games.upsertOne({
  select: {
    slug: true,
  },
  insert: {
    slug: "sequence-words",
    name: "Sequence Words",
    description: "This is an example game description.",
    created_at: now,
    updated_at: now,
  },
  update: {},
  where: {
    slug: "sequence-words",
  },
});
