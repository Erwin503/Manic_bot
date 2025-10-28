import { Context, Markup } from 'telegraf';
import { userRepo } from '../repositories/user.repo.js';
import { chatRepo } from '../repositories/chat.repo.js';
import { messageRepo } from '../repositories/message.repo.js';

const keyboards = {
  main: Markup.inlineKeyboard([[Markup.button.callback('⚡ Ping', 'ping')]]),
};

export const botService = {
  async captureCtx(ctx: Context) {
    const chat = ctx.chat as any;
    if (chat?.id) await chatRepo.ensureChat({ id: chat.id, type: chat.type });
    await userRepo.upsertFromCtx(ctx);
  },

  async onStart(ctx: Context) {
    await this.captureCtx(ctx);
    const name = ctx.from?.first_name ?? ctx.from?.username ?? 'друг';
    await ctx.reply(`Привет, ${name}! Я TypeScript-бот. /help`, keyboards.main);
  },

  async onHelp(ctx: Context) {
    await ctx.reply('Команды: /start, /help, /menu. Напиши текст — я его повторю.');
  },

  async onMenu(ctx: Context) {
    await ctx.reply('Главное меню:', keyboards.main);
  },

  async onTextEcho(ctx: Context, text: string) {
    await this.captureCtx(ctx);
    const safe = text.length > 300 ? text.slice(0, 300) + '…' : text;
    const chatId = (ctx.chat as any)?.id ?? null;
    const userId = ctx.from?.id ?? null;
    if (chatId) await messageRepo.storeMessage(chatId, userId, text);
    await ctx.reply(`Ты написал(а): "${safe}"`);
  },
};
