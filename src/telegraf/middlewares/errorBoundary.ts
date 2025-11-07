import type { Context, MiddlewareFn } from "telegraf";

export const errorBoundary = (): MiddlewareFn<Context> => {
  return async (ctx: Context, next: () => Promise<void>) => {
    try {
      await next();
    } catch (e: any) {
      try {
        await ctx.reply("Упс, что-то пошло не так 🙏");
      } catch {}
      // Можно ещё логгером:
      // logger.error({ err: e }, 'tg error');
    }
  };
};
