import { prisma } from "../db/index.js";
import { AppError } from "../lib/errors.js";
import { toReactionDTO } from "../lib/serializers.js";
import { emitToChatRoom } from "../ws/io-registry.js";
import { assertParticipant } from "./chat.service.js";
import type { Reaction as ReactionDTO } from "@app/shared";

export async function toggleReaction(
  messageId: string,
  userId: string,
  emoji: string,
): Promise<ReactionDTO[]> {
  const message = await prisma.message.findUnique({ where: { id: messageId } });
  if (!message) throw new AppError(404, "Message not found");

  // Prevent reacting to messages in chats the user isn't a participant of (IDOR).
  await assertParticipant(message.chatId, userId);

  const existing = await prisma.reaction.findUnique({
    where: { messageId_userId_emoji: { messageId, userId, emoji } },
  });

  if (existing) {
    await prisma.reaction.delete({ where: { id: existing.id } });
  } else {
    await prisma.reaction.create({ data: { messageId, userId, emoji } });
  }

  const reactions = await prisma.reaction.findMany({ where: { messageId } });
  const dtos = reactions.map(toReactionDTO);

  emitToChatRoom(message.chatId, "reaction:updated", { messageId, reactions: dtos });
  return dtos;
}
