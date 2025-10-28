import { Request, Response } from 'express';
import { bot } from '../telegraf/instance.js';
import { logger } from '../logger.js';

export const webhookController = {
  /**
   * Если кто-то всё же постучится в старый URL вебхука —
   * отвечаем, что работаем в режиме polling.
   */
  handleTelegramWebhook(_req: Request, res: Response) {
    return res.status(410).json({
      ok: false,
      mode: 'polling',
      error: 'webhook_disabled',
      message: 'This bot uses long polling. Webhook endpoint is disabled.',
    });
  },

  /**
   * Форс-отключение вебхука у Telegram (на всякий случай).
   * Удобно вызывать один раз после переключения на polling.
   */
  async disableWebhook(_req: Request, res: Response) {
    try {
      const result = await bot.telegram.deleteWebhook({ drop_pending_updates: true });
      const info = await bot.telegram.getWebhookInfo();
      logger.info({ result, info }, 'Webhook deleted (polling mode)');
      return res.json({ ok: true, mode: 'polling', result, info });
    } catch (e: any) {
      logger.error({ err: e }, 'Failed to delete webhook');
      return res.status(500).json({ ok: false, error: 'delete_webhook_failed', details: String(e?.message ?? e) });
    }
  },

  /**
   * Просто отдать текущее состояние у Telegram (должно быть пусто в polling).
   */
  async info(_req: Request, res: Response) {
    try {
      const info = await bot.telegram.getWebhookInfo();
      return res.json({ ok: true, mode: 'polling', info });
    } catch (e: any) {
      return res.status(500).json({ ok: false, error: 'get_info_failed', details: String(e?.message ?? e) });
    }
  },
};
