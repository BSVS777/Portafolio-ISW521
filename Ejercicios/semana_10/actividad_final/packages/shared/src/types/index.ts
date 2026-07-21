import type { z } from "zod";
import type {
  userSchema,
  chatSchema,
  chatListItemSchema,
  createChatRequestSchema,
  markReadRequestSchema,
  messageSchema,
  messageTypeSchema,
  deliveryStatusValueSchema,
  sendMessageRequestSchema,
  editMessageRequestSchema,
  messagesPaginationQuerySchema,
  messagesPageResponseSchema,
  simulateInboundRequestSchema,
  loginRequestSchema,
  loginResponseSchema,
  reactionSchema,
  toggleReactionRequestSchema,
  chatRoomEventSchema,
  typingEventSchema,
} from "../schemas/index.js";

export type User = z.infer<typeof userSchema>;
export type Chat = z.infer<typeof chatSchema>;
export type ChatListItem = z.infer<typeof chatListItemSchema>;
export type CreateChatRequest = z.infer<typeof createChatRequestSchema>;
export type MarkReadRequest = z.infer<typeof markReadRequestSchema>;
export type Message = z.infer<typeof messageSchema>;
export type MessageType = z.infer<typeof messageTypeSchema>;
export type DeliveryStatusValue = z.infer<typeof deliveryStatusValueSchema>;
export type SendMessageRequest = z.infer<typeof sendMessageRequestSchema>;
export type EditMessageRequest = z.infer<typeof editMessageRequestSchema>;
export type MessagesPaginationQuery = z.infer<typeof messagesPaginationQuerySchema>;
export type MessagesPageResponse = z.infer<typeof messagesPageResponseSchema>;
export type SimulateInboundRequest = z.infer<typeof simulateInboundRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type Reaction = z.infer<typeof reactionSchema>;
export type ToggleReactionRequest = z.infer<typeof toggleReactionRequestSchema>;
export type ChatRoomEvent = z.infer<typeof chatRoomEventSchema>;
export type TypingEvent = z.infer<typeof typingEventSchema>;

export type TypingState = "start" | "stop";

export interface TypingBroadcast {
  chatId: string;
  userId: string;
  state: TypingState;
}

export interface PresenceBroadcast {
  userId: string;
  online: boolean;
  lastSeenAt?: string;
}

export interface MessageStatusBroadcast {
  messageId: string;
  deliveryStatus: DeliveryStatusValue;
}

export interface ReactionUpdatedBroadcast {
  messageId: string;
  reactions: Reaction[];
}
