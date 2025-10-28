import { Router } from 'express';
import { botController } from '../../controllers/bot.controller.js';
import { auth } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { SendMessageSchema } from '../../schemas/bot.shemas.js';

export const botRouter = Router();

botRouter.use(auth);
botRouter.get('/webhookInfo', botController.webhookInfo);
botRouter.post('/sendMessage', validate(SendMessageSchema), botController.sendMessage);
