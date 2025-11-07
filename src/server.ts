import http from "http";
import { app } from "./app.js";
import { config } from "./config/index.js";
import { logger } from "./logger/index.js";
import { bot, startPolling } from "./telegraf/instance.js";
import { registerBotRouter } from "./telegraf/router.js";

registerBotRouter();

async function main() {
  await startPolling();
  logger.info("Telegraf polling started");

  const server = http.createServer(app).listen(config.PORT, () => {
    logger.info({ port: config.PORT }, "HTTP started");
  });

  const shutdown = async (sig: string) => {
    logger.info({ sig }, "Shutting down…");
    try {
      await bot.stop(sig);
    } catch {}
    server.close(() => process.exit(0));
  };
  process.once("SIGINT", () => void shutdown("SIGINT"));
  process.once("SIGTERM", () => void shutdown("SIGTERM"));
}

main().catch((e) => {
  logger.error(e);
  process.exit(1);
});
