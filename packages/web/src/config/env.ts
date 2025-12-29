import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.string().startsWith("http"),
  VITE_WS_URL: z.string().startsWith("ws"),
  VITE_CLERK_PUBLISHABLE_KEY: z.string().startsWith("pk_"),
});

export const env = envSchema.parse(import.meta.env);
