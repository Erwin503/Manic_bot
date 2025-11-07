import type { Context, MiddlewareFn } from "telegraf";

export const logging = (): MiddlewareFn<Context> => {
  return async (ctx: Context, next: () => Promise<void>) => {
    const started = Date.now();
    await next();
    const ms = Date.now() - started;
    // замените на ваш logger.info(...)
    console.log("update", ctx.update.update_id, "took", ms, "ms");
  };
};
