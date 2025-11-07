import type { Context, MiddlewareFn } from "telegraf";

const lastByUser = new Map<number, number>();

export const throttle = (ms = 500): MiddlewareFn<Context> => {
  return async (ctx: Context, next: () => Promise<void>) => {
    const id = ctx.from?.id;
    if (!id) return next();

    const now = Date.now();
    const prev = lastByUser.get(id) ?? 0;
    if (now - prev < ms) return;

    lastByUser.set(id, now);
    return next();
  };
};
