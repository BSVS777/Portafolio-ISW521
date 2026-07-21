import type { FastifyInstance } from "fastify";
import { editMessageRequestSchema, toggleReactionRequestSchema } from "@app/shared";
import * as messageService from "../services/message.service.js";
import * as reactionService from "../services/reaction.service.js";

export default async function messagesRoutes(app: FastifyInstance): Promise<void> {
  app.patch<{ Params: { messageId: string } }>(
    "/messages/:messageId",
    { preHandler: app.authenticate },
    async (request) => {
      const { body } = editMessageRequestSchema.parse(request.body);
      return messageService.editMessage(request.params.messageId, request.userId, body);
    },
  );

  app.delete<{ Params: { messageId: string } }>(
    "/messages/:messageId",
    { preHandler: app.authenticate },
    async (request, reply) => {
      await messageService.deleteMessage(request.params.messageId, request.userId);
      return reply.code(204).send();
    },
  );

  app.post<{ Params: { messageId: string } }>(
    "/messages/:messageId/reactions",
    { preHandler: app.authenticate },
    async (request) => {
      const { emoji } = toggleReactionRequestSchema.parse(request.body);
      const reactions = await reactionService.toggleReaction(
        request.params.messageId,
        request.userId,
        emoji,
      );
      return { reactions };
    },
  );
}
