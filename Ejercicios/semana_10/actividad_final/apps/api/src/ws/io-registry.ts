import type { Server as SocketIOServer } from "socket.io";

let ioInstance: SocketIOServer | undefined;

export function setIO(io: SocketIOServer): void {
  ioInstance = io;
}

export function emitToChatRoom(chatId: string, event: string, payload: unknown): void {
  ioInstance?.to(`chat:${chatId}`).emit(event, payload);
}

export function emitGlobal(event: string, payload: unknown): void {
  ioInstance?.emit(event, payload);
}
