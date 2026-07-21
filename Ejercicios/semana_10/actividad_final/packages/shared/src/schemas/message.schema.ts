import { z } from "zod";

export const messageTypeSchema = z.enum(["text", "image", "audio", "document", "system"]);

export const deliveryStatusValueSchema = z.enum(["sending", "sent", "delivered", "read", "failed"]);

export const messageSchema = z.object({
  id: z.string().uuid(),
  tempId: z.string().nullable().optional(),
  chatId: z.string().uuid(),
  senderId: z.string().uuid(),
  type: messageTypeSchema,
  body: z.string().nullable().optional(),
  mediaUrl: z.string().url().nullable().optional(),
  mediaMeta: z.record(z.string(), z.unknown()).nullable().optional(),
  replyToId: z.string().uuid().nullable().optional(),
  providerMessageId: z.string().nullable().optional(),
  deliveryStatus: deliveryStatusValueSchema.default("sending"),
  editedAt: z.string().datetime().nullable().optional(),
  deletedForAll: z.boolean().default(false),
  createdAt: z.string().datetime(),
});

export const mediaMetaSchema = z
  .object({
    mimeType: z.string(),
    filename: z.string().optional(),
  })
  .catchall(z.unknown());

export const sendMessageRequestSchema = z
  .object({
    tempId: z.string().min(1),
    type: messageTypeSchema.default("text"),
    body: z.string().min(1).optional(),
    mediaUrl: z.string().url().optional(),
    mediaMeta: mediaMetaSchema.optional(),
    replyToId: z.string().uuid().optional(),
  })
  .refine((data) => (data.type === "text" ? !!data.body : !!data.mediaUrl), {
    message: "Text messages require a body; media messages require a mediaUrl",
    path: ["body"],
  });

export const editMessageRequestSchema = z.object({
  body: z.string().min(1),
});

export const messagesPaginationQuerySchema = z.object({
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const messagesPageResponseSchema = z.object({
  messages: z.array(messageSchema),
  nextCursor: z.string().uuid().nullable(),
});

export const simulateInboundRequestSchema = z.object({
  chatId: z.string().uuid(),
  body: z.string().min(1),
});
