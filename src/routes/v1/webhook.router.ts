import { Router } from 'express';
import { webhookController } from '../../controllers/webhook.controller.js';

export const webhookRouter = Router();

// Старый путь вебхука — теперь всегда 410 (мы в polling)
webhookRouter.post('/telegram/:secret', webhookController.handleTelegramWebhook);

// Служебные ручки
webhookRouter.post('/disable', webhookController.disableWebhook);
webhookRouter.get('/info', webhookController.info);
