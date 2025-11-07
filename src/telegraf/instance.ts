import { Telegraf, Context } from "telegraf";
import { config } from "../config/index.js";

export const bot = new Telegraf<Context>(config.BOT_TOKEN);

export async function startPolling() {
  await bot.telegram
    .deleteWebhook({ drop_pending_updates: false })
    .catch(() => {});
  await bot.launch({ dropPendingUpdates: false });
}
