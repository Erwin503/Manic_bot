import type { Context } from "telegraf";
import { db } from "../../db/knex.js";

export const contactHandler = () => async (ctx: Context) => {
  const c = (ctx.message as any)?.contact;
  if (!c) return;
  await db("users").where({ id: ctx.from!.id }).update({
    phone: c.phone_number,
    phone_verified: 1,
    updated_at: db.fn.now(),
  });
  await ctx.reply("Спасибо! Телефон сохранён 📲 Сейчас предложу услуги…");
};
