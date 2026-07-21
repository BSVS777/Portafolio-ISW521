import { z } from "zod";

export const chatRoomEventSchema = z.object({
  chatId: z.string().uuid(),
});

export const typingEventSchema = z.object({
  chatId: z.string().uuid(),
});
