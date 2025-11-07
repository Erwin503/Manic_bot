import type { Context } from "telegraf";
import { userService } from "../../domain/user/user.service.js";
import { keyboards } from "../keyboards/common.js";

export const startCommand = () => async (ctx: Context) => {
  const user = await userService.upsertFromCtx(ctx);
  const name = user?.first_name || user?.username || "друг";

  await ctx.reply(
    `Привет, ${name}! 👋 Я помогу записаться на маникюр.\nДля подтверждения записи нужен номер телефона.`,
    keyboards.sharePhone()
  );

  // Если телефон уже есть — можно сразу звать меню услуг:
  // await ctx.reply('Отлично, телефон уже есть 👍 Давай выберем услугу?');
};
