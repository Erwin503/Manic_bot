// src/server.ts (ESM, long polling)
import http from 'http';
import { app } from './app.js';                 // твои маршруты (/healthz, /v1/**)
import { config } from './config.js';
import { logger } from './logger.js';
import { bot, startPolling } from './telegraf/instance.js';
import { registerBotHandlers } from './telegraf/handlers.js';

// подключаем все хендлеры бота один раз
registerBotHandlers();

async function main() {
  // 1) убедимся, что вебхук снят, и запустим long polling
  await startPolling();
  logger.info('Telegraf polling started');

  // 2) опционально поднимем HTTP-сервер (для healthz/внутренних ручек)
  const server = http.createServer(app).listen(config.port, () => {
    logger.info({ port: config.port }, 'HTTP started');
  });

  // 3) graceful shutdown
  const shutdown = async (sig: string) => {
    logger.info({ sig }, 'Shutting down…');
    try { await bot.stop(sig); } catch {}
    server.close(() => process.exit(0));
  };

  process.once('SIGINT',  () => void shutdown('SIGINT'));
  process.once('SIGTERM', () => void shutdown('SIGTERM'));
}

main().catch((e) => {
  logger.error({ err: e }, 'Startup error');
  process.exit(1);
});
