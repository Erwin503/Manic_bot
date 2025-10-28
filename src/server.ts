import { app } from './app.js';
import { config } from './config.js';
import { bot } from './telegraf/instance.js';
import { telegramService } from './services/telegram.service.js';
import { closeDb } from './db/knex.js';
import { logger } from './logger.js';

async function main() {
  const server = app.listen(config.port, async () => {
    const fullUrl = `${config.baseUrl}/v1/webhook/telegram/${config.secret}`;
    await telegramService.setWebhook(fullUrl, config.secret);
    logger.info({ port: config.port, fullUrl }, 'HTTP started');
  });

  const shutdown = async (sig: string) => {
    logger.info({ sig }, 'Shutting down…');
    await bot.stop(sig);
    await closeDb();
    server.close(() => process.exit(0));
  };

  process.once('SIGINT', () => void shutdown('SIGINT'));
  process.once('SIGTERM', () => void shutdown('SIGTERM'));
}

main().catch((e) => {
  console.error('Startup error', e);
  process.exit(1);
});
