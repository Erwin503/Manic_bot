import { Request, Response, NextFunction } from 'express';
import { config } from '../config.js';

export function auth(req: Request, res: Response, next: NextFunction) {
  if (!config.internalApiKey) return next(); // опционально отключаем, если ключ не задан
  const key = req.get('x-internal-api-key');
  if (key !== config.internalApiKey) return res.sendStatus(401);
  next();
}
