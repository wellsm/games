import type { String } from "@ez4/schema";

export type PlayerResult = {
  id: String.UUID;
  name: string;
  seat: number;
};
