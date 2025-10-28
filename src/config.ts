import "dotenv/config.js";

export const config = {
  token: process.env.BOT_TOKEN ?? "",
  port: Number(process.env.PORT ?? 3000),
  internalApiKey: process.env.INTERNAL_API_KEY ?? "", // для админских методов
};

if (!config.token) throw new Error("BOT_TOKEN is required");
