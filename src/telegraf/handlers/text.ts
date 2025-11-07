import type { Context } from "telegraf";
export const textHandler = () => async (ctx: Context) => {
  await ctx.reply("Напиши /start чтобы начать 😊");
};
