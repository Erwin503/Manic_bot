import 'dotenv/config.js';

export const config = {
  token: process.env.BOT_TOKEN ?? '',
  baseUrl: process.env.WEBHOOK_URL ?? '',
  secret: process.env.WEBHOOK_SECRET ?? '',
  port: Number(process.env.PORT ?? 3000),
  internalApiKey: process.env.INTERNAL_API_KEY ?? '', // для админских методов
};

if (!config.token) throw new Error('BOT_TOKEN is required');
if (!config.baseUrl) throw new Error('WEBHOOK_URL is required');
if (!config.secret) throw new Error('WEBHOOK_SECRET is required');
