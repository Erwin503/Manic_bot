import { db } from "../knex.js";
import type { Context } from "telegraf";

export type UserRow = {
  id: number;
  chat_id: number | null;
  chat_type: "private" | "group" | "supergroup" | "channel" | null;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  phone_verified: 0 | 1 | boolean;
  tg_language: string | null;
  last_seen_at?: Date | null;
};

export const userRepo = {
  async upsertFromCtx(ctx: Context) {
    const u = ctx.from!;
    const chat = ctx.chat!;
    const row: Partial<UserRow> & Pick<UserRow, "id"> = {
      id: u.id,
      chat_id: chat?.id ?? null,
      chat_type: (chat?.type as any) ?? null,
      username: u.username ?? null,
      first_name: u.first_name ?? null,
      last_name: u.last_name ?? null,
      tg_language: (u as any).language_code ?? null,
      last_seen_at: new Date(),
    };
    await db<UserRow>("users")
      .insert(row as any)
      .onConflict("id")
      .merge({
        chat_id: row.chat_id ?? null,
        chat_type: row.chat_type ?? null,
        username: row.username ?? null,
        first_name: row.first_name ?? null,
        last_name: row.last_name ?? null,
        tg_language: row.tg_language ?? null,
        last_seen_at: db.fn.now(),
      });
    return db<UserRow>("users").where({ id: row.id }).first();
  },
};
