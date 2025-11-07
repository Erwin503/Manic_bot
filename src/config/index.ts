import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  BOT_TOKEN: z.string().min(10),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().int().default(3306),
  DB_USER: z.string(),
  DB_PASS: z.string(),
  DB_NAME: z.string(),
  PORT: z.coerce.number().int().default(3000),
});

export const config = EnvSchema.parse(process.env);
