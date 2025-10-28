import { Response } from 'express';
import { bot } from '../telegraf/instance.js';

export const telegramService = {
  async setWebhook(fullUrl: string, secret: string) {
    // «обнулим» прошлый вебхук на всякий случай
    await bot.telegram.deleteWebhook({ drop_pending_updates: false }).catch(() => {});
    await bot.telegram.setWebhook(fullUrl, {
      secret_token: secret,
      drop_pending_updates: true,
    });
    return bot.telegram.getWebhookInfo();
  },

  handleUpdate(body: any, res?: Response) {
    return (bot as any).handleUpdate(body, res);
  },
};
