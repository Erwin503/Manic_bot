import { Request, Response } from 'express';
import { bot } from '../telegraf/instance.js';
import { z } from 'zod';
import { SendMessageSchema } from '../schemas/bot.shemas.js';

export const botController = {
  async sendMessage(req: Request, res: Response) {
    const parsed = SendMessageSchema.safeParse({ body: req.body });
    if (!parsed.success) return res.status(422).json({ errors: parsed.error.flatten() });

    const { chatId, text } = parsed.data.body;
    await bot.telegram.sendMessage(chatId, text);
    res.json({ ok: true });
  },

  async webhookInfo(_req: Request, res: Response) {
    const info = await bot.telegram.getWebhookInfo();
    res.json(info);
  },
};
