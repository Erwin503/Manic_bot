import { Router } from 'express';
import { webhookRouter } from './webhook.router.js';
import { botRouter } from './bot.router.js';

export const v1 = Router();

v1.use('/webhook', webhookRouter);
v1.use('/bot', botRouter);
