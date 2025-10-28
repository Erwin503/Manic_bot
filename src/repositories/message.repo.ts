import { db } from '../db/knex.js';

export const messageRepo = {
  async storeMessage(chatId: number, userId: number | null, text: string) {
    await db('messages').insert({ chat_id: chatId, user_id: userId, text });
  },
};
