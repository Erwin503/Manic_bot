import { db } from '../db/knex.js';

export type DbUser = {
  id: number; username?: string | null; first_name?: string | null; last_name?: string | null;
  created_at?: Date; updated_at?: Date;
};

export const userRepo = {
  async upsertFromCtx(ctx: any) {
    const id = ctx.from?.id as number | undefined;
    if (!id) return;

    const row: Partial<DbUser> = {
      id,
      username: ctx.from?.username ?? null,
      first_name: ctx.from?.first_name ?? null,
      last_name: ctx.from?.last_name ?? null,
    };

    // upsert (для MySQL 8+)
    await db('users')
      .insert(row)
      .onConflict('id')
      .merge({ ...row, updated_at: db.fn.now() });
  },
};
