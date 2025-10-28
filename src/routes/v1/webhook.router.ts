import { Router } from 'express';
import { webhookController } from '../../controllers/webhook.controller.js';

export const webhookRouter = Router();

// вход от Telegram
webhookRouter.post('/telegram/:secret', webhookController.handleTelegramWebhook);

// удобная ручка для первичной регистрации вебхука
webhookRouter.post('/setup', webhookController.setupWebhook);
