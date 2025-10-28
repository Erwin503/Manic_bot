import { Request, Response } from 'express';
import { config } from '../config.js';
import { telegramService } from '../services/telegram.service.js';
import { logger } from '../logger.js';

export const webhookController = {
  handleTelegramWebhook(req: Request, res: Response) {
    const pathSecret = req.params.secret;
    const headerSecret = req.get('x-telegram-bot-api-secret-token');

    if (pathSecret !== config.secret || headerSecret !== config.secret) {
      logger.warn({ pathSecret, headerSecretPresent: Boolean(headerSecret) }, 'Webhook auth failed');
      return res.sendStatus(401);
    }

    // опционально: быстрый health log
    logger.debug({ updateType: req.body?.update_id ? 'ok' : 'unknown' }, 'Incoming update');
    return telegramService.handleUpdate(req.body, res);
  },

  async setupWebhook(_req: Request, res: Response) {
    const fullUrl = `${config.baseUrl}/v1/webhook/telegram/${config.secret}`;
    const info = await telegramService.setWebhook(fullUrl, config.secret);
    res.json({ ok: true, fullUrl, info });
  },
};
