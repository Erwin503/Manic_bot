import http from "http";
import { app } from "./app.js"; // твои роуты/healthz/внутренние API
import { config } from "./config.js";
import { logger } from "./logger.js";
import { bot } from "./telegraf/instance.js";
import { startPolling } from "./telegraf/instance.js";

async function main() {
  // 1) стартуем polling
  await startPolling();
  logger.info("Telegraf polling started");

  // 2) (опционально) поднимем HTTP для healthz и внутренних ручек
  const server = http.createServer(app).listen(config.port, () => {
    logger.info({ port: config.port }, "HTTP started");
  });

  // graceful shutdown
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
  console.error("Startup error", e);
  process.exit(1);
});
