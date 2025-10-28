import express from 'express';
import { routes } from './routes/index.js';
import { notFound, errorHandler } from './middlewares/error.js';
import { registerBotHandlers } from './telegraf/handlers.js';
import { httpLogger } from './logger.js';

registerBotHandlers();

export const app = express();
app.use(httpLogger);                      // <— pino-http
app.use(express.json({ limit: '1mb' }));
app.use(routes);
app.use(notFound);
app.use(errorHandler);
