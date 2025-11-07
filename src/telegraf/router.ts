import { bot } from "./instance.js";
import { errorBoundary } from "./middlewares/errorBoundary.js";
import { logging } from "./middlewares/logging.js";
import { throttle } from "./middlewares/throttle.js";
import { startCommand } from "./commands/start.js";
import { contactHandler } from "./handlers/contact.js";
import { textHandler } from "./handlers/text.js";

export function registerBotRouter() {
  bot.use(errorBoundary());
  bot.use(logging());
  bot.use(throttle(400));

  bot.start(startCommand());
  bot.on("contact", contactHandler());
  bot.on("text", textHandler());
}
