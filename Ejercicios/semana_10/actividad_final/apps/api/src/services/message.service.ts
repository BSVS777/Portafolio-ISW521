import type { Message as PrismaMessage, Prisma } from "@prisma/client";
import type {
  Message as MessageDTO,
  SendMessageRequest,
  DeliveryStatus,
  InboundMessage,
  MediaPayload,
  MessagingProvider,
} from "@app/shared";
import { mediaMetaSchema } from "@app/shared";
import { prisma } from "../db/index.js";
import { AppError } from "../lib/errors.js";
import { toMessageDTO } from "../lib/serializers.js";
import { emitToChatRoom } from "../ws/io-registry.js";
import { getMessagingProvider } from "../providers/instance.js";
import { enqueueOutboundRetry } from "../queues/outbound-retry.queue.js";
import * as chatService from "./chat.service.js";

export async function listMessages(
  chatId: string,
  userId: string,
  cursor: string | undefined,
  limit: number,
): Promise<{ messages: MessageDTO[]; nextCursor: string | null }> {
  await chatService.assertParticipant(chatId, userId);

  const rows = await prisma.message.findMany({
    where: { chatId },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore ? (page.at(-1)?.id ?? null) : null;

  return { messages: page.map(toMessageDTO), nextCursor };
}

export async function sendMessage(
  chatId: string,
  userId: string,
  input: SendMessageRequest,
): Promise<MessageDTO> {
  await chatService.assertParticipant(chatId, userId);

  const message = await prisma.message.create({
    data: {
      chatId,
      senderId: userId,
      tempId: input.tempId,
      type: input.type,
      body: input.body,
      mediaUrl: input.mediaUrl,
      // Already zod-validated as JSON-safe at the route boundary.
      mediaMeta: input.mediaMeta as Prisma.InputJsonValue | undefined,
      replyToId: input.replyToId,
      deliveryStatus: "sending",
    },
  });

  const dto = toMessageDTO(message);
  emitToChatRoom(chatId, "message:new", dto);

  void dispatchOutbound(message);

  return dto;
}

function buildMediaPayload(message: PrismaMessage): MediaPayload {
  const parsedMeta = mediaMetaSchema.safeParse(message.mediaMeta);
  return {
    kind: message.type as "image" | "audio" | "document",
    url: message.mediaUrl ?? "",
    mimeType: parsedMeta.success ? parsedMeta.data.mimeType : "application/octet-stream",
    filename: parsedMeta.success ? parsedMeta.data.filename : undefined,
  };
}

async function dispatchOutbound(message: PrismaMessage): Promise<void> {
  const provider = getMessagingProvider();
  const to = message.chatId;

  try {
    const result =
      message.type === "text"
        ? await provider.sendText(to, message.body ?? "")
        : await provider.sendMedia(to, buildMediaPayload(message));

    // deliveryStatus stays "sending" here on purpose: the provider's own
    // onStatus stream (applyProviderStatus) is what drives sent/delivered/read,
    // matching how a real provider ack and its delivery webhook are separate.
    await prisma.message.update({
      where: { id: message.id },
      data: { providerMessageId: result.providerMessageId },
    });
  } catch {
    const mediaPayload = message.type !== "text" ? buildMediaPayload(message) : undefined;
    await enqueueOutboundRetry({
      messageId: message.id,
      chatId: message.chatId,
      to,
      kind: message.type === "text" ? "text" : "media",
      body: message.body ?? undefined,
      mediaUrl: mediaPayload?.url,
      mimeType: mediaPayload?.mimeType,
      mediaKind: mediaPayload?.kind,
    });
  }
}

export async function editMessage(
  messageId: string,
  userId: string,
  body: string,
): Promise<MessageDTO> {
  const message = await prisma.message.findUnique({ where: { id: messageId } });
  if (!message) throw new AppError(404, "Message not found");
  if (message.senderId !== userId) throw new AppError(403, "You can only edit your own messages");
  if (message.deletedForAll) throw new AppError(400, "Cannot edit a deleted message");

  const updated = await prisma.message.update({
    where: { id: messageId },
    data: { body, editedAt: new Date() },
  });

  const dto = toMessageDTO(updated);
  emitToChatRoom(updated.chatId, "message:edited", dto);
  return dto;
}

export async function deleteMessage(messageId: string, userId: string): Promise<void> {
  const message = await prisma.message.findUnique({ where: { id: messageId } });
  if (!message) throw new AppError(404, "Message not found");
  if (message.senderId !== userId) throw new AppError(403, "You can only delete your own messages");

  await prisma.message.update({ where: { id: messageId }, data: { deletedForAll: true } });
  emitToChatRoom(message.chatId, "message:deleted", { messageId });
}

export async function applyProviderStatus(status: DeliveryStatus): Promise<void> {
  const message = await prisma.message.findUnique({
    where: { providerMessageId: status.providerMessageId },
  });
  if (!message) return;

  await prisma.message.update({
    where: { id: message.id },
    data: { deliveryStatus: status.status },
  });

  emitToChatRoom(message.chatId, "message:status", {
    messageId: message.id,
    deliveryStatus: status.status,
    error: status.error,
  });
}

/**
 * Mock-only convention: MockProvider.simulateInboundReply encodes
 * `from` as "<chatId>::<userIdToExclude>" since it has no real phone routing.
 */
export async function createInboundFromProvider(inbound: InboundMessage): Promise<void> {
  const [chatId, excludeUserId] = inbound.from.split("::");
  if (!chatId) return;

  const chat = await prisma.chat.findUnique({ where: { id: chatId } });
  if (!chat) return;

  const senderId = await chatService.findOtherParticipantId(chatId, excludeUserId ?? "");
  if (!senderId) return;

  const message = await prisma.message.create({
    data: {
      chatId,
      senderId,
      type: inbound.media ? inbound.media.kind : "text",
      body: inbound.body,
      mediaUrl: inbound.media?.url,
      mediaMeta: inbound.media
        ? { mimeType: inbound.media.mimeType, filename: inbound.media.filename }
        : undefined,
      providerMessageId: inbound.providerMessageId,
      deliveryStatus: "delivered",
    },
  });

  emitToChatRoom(chatId, "message:new", toMessageDTO(message));
}

export function registerProviderHandlers(provider: MessagingProvider): void {
  provider.onStatus((status) => {
    void applyProviderStatus(status);
  });
  provider.onInbound((inbound) => {
    void createInboundFromProvider(inbound);
  });
}
