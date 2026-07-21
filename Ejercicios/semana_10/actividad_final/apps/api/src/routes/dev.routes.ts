import type { FastifyInstance } from "fastify";
import { simulateInboundRequestSchema } from "@app/shared";
import { prisma } from "../db/index.js";
import { AppError } from "../lib/errors.js";
import { emitToChatRoom } from "../ws/io-registry.js";
import { assertParticipant } from "../services/chat.service.js";
import type { MockProvider } from "../providers/mock/mock-provider.js";

interface DevRoutesOptions {
  provider: MockProvider;
}

export default async function devRoutes(app: FastifyInstance, opts: DevRoutesOptions): Promise<void> {
  const { provider } = opts;

  app.post(
    "/dev/mock/simulate-inbound",
    { preHandler: app.authenticate },
    async (request, reply) => {
      const { chatId, body } = simulateInboundRequestSchema.parse(request.body);

      const chat = await prisma.chat.findUnique({ where: { id: chatId } });
      if (!chat) throw new AppError(404, "Chat not found");
      // Only participants of this chat may trigger a simulated inbound reply into it.
      await assertParticipant(chatId, request.userId);

      emitToChatRoom(chatId, "typing", { chatId, userId: "mock", state: "start" });

      void (async () => {
        await provider.simulateInboundReply(chatId, body, request.userId);
        emitToChatRoom(chatId, "typing", { chatId, userId: "mock", state: "stop" });
      })();

      return reply.code(202).send({ status: "queued" });
    },
  );
}
