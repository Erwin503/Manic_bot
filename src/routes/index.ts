import { Router } from 'express';
import { v1 } from './v1/index.js';

export const routes = Router();

routes.use('/v1', v1);
routes.get('/healthz', (_req, res) => res.status(200).send('ok'));
