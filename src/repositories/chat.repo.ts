import { db } from '../db/knex.js';

export const chatRepo = {
  async ensureChat(chat: { id: number; type: string }) {
    await db('chats')
      .insert({ id: chat.id, type: chat.type })
      .onConflict('id')
      .ignore();
  },
};
