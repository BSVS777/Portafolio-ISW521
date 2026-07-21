import type { User, Chat, Message, Reaction } from "@prisma/client";
import type {
  User as UserDTO,
  Chat as ChatDTO,
  Message as MessageDTO,
  Reaction as ReactionDTO,
} from "@app/shared";
import { mediaMetaSchema } from "@app/shared";

export function toChatDTO(chat: Chat): ChatDTO {
  return {
    id: chat.id,
    isGroup: chat.isGroup,
    title: chat.title,
    avatarUrl: chat.avatarUrl,
    createdAt: chat.createdAt.toISOString(),
  };
}

export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    phone: user.phone,
    status: user.status,
    lastSeenAt: user.lastSeenAt ? user.lastSeenAt.toISOString() : null,
    createdAt: user.createdAt.toISOString(),
  };
}

export function toMessageDTO(message: Message): MessageDTO {
  const parsedMeta = mediaMetaSchema.safeParse(message.mediaMeta);
  return {
    id: message.id,
    tempId: message.tempId,
    chatId: message.chatId,
    senderId: message.senderId,
    type: message.type as MessageDTO["type"],
    body: message.body,
    mediaUrl: message.mediaUrl,
    mediaMeta: parsedMeta.success ? parsedMeta.data : null,
    replyToId: message.replyToId,
    providerMessageId: message.providerMessageId,
    deliveryStatus: message.deliveryStatus as MessageDTO["deliveryStatus"],
    editedAt: message.editedAt ? message.editedAt.toISOString() : null,
    deletedForAll: message.deletedForAll,
    createdAt: message.createdAt.toISOString(),
  };
}

export function toReactionDTO(reaction: Reaction): ReactionDTO {
  return {
    id: reaction.id,
    messageId: reaction.messageId,
    userId: reaction.userId,
    emoji: reaction.emoji,
    createdAt: reaction.createdAt.toISOString(),
  };
}
