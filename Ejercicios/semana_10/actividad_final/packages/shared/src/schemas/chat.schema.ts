import { z } from "zod";
import { messageSchema } from "./message.schema.js";

export const chatSchema = z.object({
  id: z.string().uuid(),
  isGroup: z.boolean(),
  title: z.string().nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  createdAt: z.string().datetime(),
});

export const chatParticipantRoleSchema = z.enum(["member", "admin"]);

export const createChatRequestSchema = z
  .object({
    isGroup: z.boolean(),
    title: z.string().min(1).optional(),
    participantIds: z.array(z.string().uuid()).min(1),
  })
  .refine((data) => data.isGroup || data.participantIds.length === 1, {
    message: "A 1:1 chat requires exactly one other participant",
    path: ["participantIds"],
  });

export const chatListItemSchema = chatSchema.extend({
  lastMessage: messageSchema.nullable(),
  unreadCount: z.number().int().nonnegative(),
  pinned: z.boolean(),
});

export const markReadRequestSchema = z.object({
  messageId: z.string().uuid(),
});
