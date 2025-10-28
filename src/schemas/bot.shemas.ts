import { z } from 'zod';

export const SendMessageSchema = z.object({
  body: z.object({
    chatId: z.number().int().or(z.string().regex(/^\d+$/).transform(Number)),
    text: z.string().min(1).max(4096),
  }),
});
