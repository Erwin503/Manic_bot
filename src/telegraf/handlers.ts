import { bot } from "./instance.js";
import { botService } from "../services/bot.service.js";

export function registerBotHandlers() {
  bot.start((ctx) => botService.onStart(ctx));
  bot.help((ctx) => botService.onHelp(ctx));
  bot.on("text", async (ctx) => {
    const t = ctx.message.text.trim();
    if (t === "/menu") return botService.onMenu(ctx);
    await botService.onTextEcho(ctx, t);
  });

  bot.catch(async (err, ctx) => {
    console.error("Bot error:", err);
    try {
      await ctx.reply("Упс, что-то пошло не так 🙏");
    } catch {}
  });
}
