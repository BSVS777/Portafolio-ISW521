import { prisma } from "../db/index.js";
import { AppError } from "../lib/errors.js";
import { toMessageDTO } from "../lib/serializers.js";
import type { ChatListItem, CreateChatRequest } from "@app/shared";

export async function assertParticipant(chatId: string, userId: string): Promise<void> {
  const participant = await prisma.chatParticipant.findUnique({
    where: { chatId_userId: { chatId, userId } },
  });
  if (!participant) {
    throw new AppError(404, "Chat not found");
  }
}

export async function listChatIdsForUser(userId: string): Promise<string[]> {
  const rows = await prisma.chatParticipant.findMany({
    where: { userId },
    select: { chatId: true },
  });
  return rows.map((row) => row.chatId);
}

export async function listChatsForUser(userId: string): Promise<ChatListItem[]> {
  const participations = await prisma.chatParticipant.findMany({
    where: { userId },
    include: {
      chat: {
        include: {
          messages: {
            where: { deletedForAll: false },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  const items = await Promise.all(
    participations.map(async (participation) => {
      const { chat } = participation;
      const lastMessage = chat.messages[0] ?? null;

      let unreadCount = 0;
      if (participation.lastReadMessageId) {
        const lastRead = await prisma.message.findUnique({
          where: { id: participation.lastReadMessageId },
          select: { createdAt: true },
        });
        unreadCount = await prisma.message.count({
          where: {
            chatId: chat.id,
            senderId: { not: userId },
            deletedForAll: false,
            createdAt: lastRead ? { gt: lastRead.createdAt } : undefined,
          },
        });
      } else {
        unreadCount = await prisma.message.count({
          where: { chatId: chat.id, senderId: { not: userId }, deletedForAll: false },
        });
      }

      const item: ChatListItem = {
        id: chat.id,
        isGroup: chat.isGroup,
        title: chat.title,
        avatarUrl: chat.avatarUrl,
        createdAt: chat.createdAt.toISOString(),
        lastMessage: lastMessage ? toMessageDTO(lastMessage) : null,
        unreadCount,
        pinned: participation.pinnedAt !== null,
      };

      return {
        item,
        lastActivity: lastMessage?.createdAt ?? chat.createdAt,
      };
    }),
  );

  items.sort((a, b) => {
    if (a.item.pinned !== b.item.pinned) {
      return a.item.pinned ? -1 : 1;
    }
    return b.lastActivity.getTime() - a.lastActivity.getTime();
  });

  return items.map((entry) => entry.item);
}

export async function createChat(userId: string, input: CreateChatRequest) {
  const participantIds = Array.from(new Set([userId, ...input.participantIds]));

  if (!input.isGroup) {
    const otherUserId = participantIds.find((id) => id !== userId);
    if (otherUserId) {
      const existing = await prisma.chat.findFirst({
        where: {
          isGroup: false,
          AND: [
            { participants: { some: { userId } } },
            { participants: { some: { userId: otherUserId } } },
          ],
        },
      });
      if (existing) {
        return existing;
      }
    }
  }

  return prisma.chat.create({
    data: {
      isGroup: input.isGroup,
      title: input.title,
      participants: {
        create: participantIds.map((id) => ({
          userId: id,
          role: input.isGroup && id === userId ? "admin" : "member",
        })),
      },
    },
  });
}

export async function markRead(chatId: string, userId: string, messageId: string): Promise<void> {
  await assertParticipant(chatId, userId);

  const message = await prisma.message.findUnique({ where: { id: messageId } });
  if (!message || message.chatId !== chatId) {
    throw new AppError(404, "Message not found in this chat");
  }

  await prisma.chatParticipant.update({
    where: { chatId_userId: { chatId, userId } },
    data: { lastReadMessageId: messageId },
  });
}

export async function findOtherParticipantId(chatId: string, excludeUserId: string): Promise<string | null> {
  const participant = await prisma.chatParticipant.findFirst({
    where: { chatId, userId: { not: excludeUserId } },
    select: { userId: true },
  });
  return participant?.userId ?? null;
}
