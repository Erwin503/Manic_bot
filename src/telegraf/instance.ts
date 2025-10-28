import { Telegraf, Context } from 'telegraf';
import { config } from '../config.js';

export const bot = new Telegraf<Context>(config.token);
