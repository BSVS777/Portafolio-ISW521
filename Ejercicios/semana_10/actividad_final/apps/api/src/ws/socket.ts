import { Server as SocketIOServer } from "socket.io";
import type { Server as HTTPServer } from "node:http";
import { chatRoomEventSchema, typingEventSchema } from "@app/shared";
import { verifyAccessToken } from "../lib/jwt.js";
import * as chatService from "../services/chat.service.js";
import * as presenceService from "../services/presence.service.js";

export function createSocketServer(httpServer: HTTPServer): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: { origin: "*" },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as unknown;
    if (typeof token !== "string") {
      next(new Error("Unauthorized"));
      return;
    }
    try {
      socket.data.userId = verifyAccessToken(token);
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId as string;

    void (async () => {
      await presenceService.markOnline(userId);
      const chatIds = await chatService.listChatIdsForUser(userId);
      for (const chatId of chatIds) {
        await socket.join(`chat:${chatId}`);
      }
      io.emit("presence:update", { userId, online: true });
    })();

    socket.on("chat:join", (payload: unknown) => {
      const parsed = chatRoomEventSchema.safeParse(payload);
      if (!parsed.success) return;
      const { chatId } = parsed.data;
      void (async () => {
        try {
          // Membership check prevents an authenticated socket from joining a room
          // for a chat it isn't a participant of (would otherwise leak message/
          // reaction/typing events for that chat).
          await chatService.assertParticipant(chatId, userId);
          await socket.join(`chat:${chatId}`);
        } catch {
          // Not a participant (or chat doesn't exist) — silently ignore the join.
        }
      })();
    });

    socket.on("chat:leave", (payload: unknown) => {
      const parsed = chatRoomEventSchema.safeParse(payload);
      if (!parsed.success) return;
      void socket.leave(`chat:${parsed.data.chatId}`);
    });

    socket.on("typing:start", (payload: unknown) => {
      const parsed = typingEventSchema.safeParse(payload);
      if (!parsed.success) return;
      socket.to(`chat:${parsed.data.chatId}`).emit("typing", {
        chatId: parsed.data.chatId,
        userId,
        state: "start",
      });
    });

    socket.on("typing:stop", (payload: unknown) => {
      const parsed = typingEventSchema.safeParse(payload);
      if (!parsed.success) return;
      socket.to(`chat:${parsed.data.chatId}`).emit("typing", {
        chatId: parsed.data.chatId,
        userId,
        state: "stop",
      });
    });

    socket.on("disconnect", () => {
      void (async () => {
        await presenceService.markOffline(userId);
        io.emit("presence:update", {
          userId,
          online: false,
          lastSeenAt: new Date().toISOString(),
        });
      })();
    });
  });

  return io;
}
