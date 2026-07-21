import { z } from "zod";

export const reactionSchema = z.object({
  id: z.string().uuid(),
  messageId: z.string().uuid(),
  userId: z.string().uuid(),
  emoji: z.string().min(1),
  createdAt: z.string().datetime(),
});

export const toggleReactionRequestSchema = z.object({
  emoji: z.string().min(1).max(8),
});
