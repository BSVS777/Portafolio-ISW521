import type { FastifyInstance } from "fastify";
import {
  createChatRequestSchema,
  markReadRequestSchema,
  messagesPaginationQuerySchema,
  sendMessageRequestSchema,
} from "@app/shared";
import * as chatService from "../services/chat.service.js";
import * as messageService from "../services/message.service.js";
import { toChatDTO } from "../lib/serializers.js";

export default async function chatsRoutes(app: FastifyInstance): Promise<void> {
  app.get("/chats", { preHandler: app.authenticate }, async (request) => {
    return chatService.listChatsForUser(request.userId);
  });

  app.post("/chats", { preHandler: app.authenticate }, async (request, reply) => {
    const input = createChatRequestSchema.parse(request.body);
    const chat = await chatService.createChat(request.userId, input);
    return reply.code(201).send(toChatDTO(chat));
  });

  app.get<{ Params: { chatId: string } }>(
    "/chats/:chatId/messages",
    { preHandler: app.authenticate },
    async (request) => {
      const { cursor, limit } = messagesPaginationQuerySchema.parse(request.query);
      return messageService.listMessages(request.params.chatId, request.userId, cursor, limit);
    },
  );

  app.post<{ Params: { chatId: string } }>(
    "/chats/:chatId/messages",
    { preHandler: app.authenticate },
    async (request, reply) => {
      const input = sendMessageRequestSchema.parse(request.body);
      const message = await messageService.sendMessage(request.params.chatId, request.userId, input);
      return reply.code(201).send(message);
    },
  );

  app.patch<{ Params: { chatId: string } }>(
    "/chats/:chatId/read",
    { preHandler: app.authenticate },
    async (request, reply) => {
      const { messageId } = markReadRequestSchema.parse(request.body);
      await chatService.markRead(request.params.chatId, request.userId, messageId);
      return reply.code(204).send();
    },
  );
}
