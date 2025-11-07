import type { Context } from "telegraf";
import { userRepo } from "../../repositories/user.repo.js";

export const userService = {
  upsertFromCtx: (ctx: Context) => userRepo.upsertFromCtx(ctx),
};
