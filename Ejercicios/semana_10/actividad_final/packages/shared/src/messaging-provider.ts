export interface MessagingProvider {
  sendText(to: string, body: string): Promise<{ providerMessageId: string }>;
  sendMedia(to: string, media: MediaPayload): Promise<{ providerMessageId: string }>;
  markAsRead(providerMessageId: string): Promise<void>;
  onInbound(handler: (msg: InboundMessage) => void): void;
  onStatus(handler: (s: DeliveryStatus) => void): void;
}

export interface MediaPayload {
  kind: "image" | "audio" | "document";
  url: string;
  mimeType: string;
  filename?: string;
}

export interface InboundMessage {
  providerMessageId: string;
  from: string;
  body?: string;
  media?: MediaPayload;
  receivedAt: string; // ISO timestamp
}

export interface DeliveryStatus {
  providerMessageId: string;
  status: "sent" | "delivered" | "read" | "failed";
  timestamp: string; // ISO timestamp
  error?: string;
}
