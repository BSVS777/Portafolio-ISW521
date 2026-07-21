import type {
  DeliveryStatus,
  InboundMessage,
  MediaPayload,
  MessagingProvider,
} from "@app/shared";

export class CloudApiProvider implements MessagingProvider {
  async sendText(_to: string, _body: string): Promise<{ providerMessageId: string }> {
    throw new Error("not implemented — Fase 4/5");
  }

  async sendMedia(
    _to: string,
    _media: MediaPayload,
  ): Promise<{ providerMessageId: string }> {
    throw new Error("not implemented — Fase 4/5");
  }

  async markAsRead(_providerMessageId: string): Promise<void> {
    throw new Error("not implemented — Fase 4/5");
  }

  onInbound(_handler: (msg: InboundMessage) => void): void {
    throw new Error("not implemented — Fase 4/5");
  }

  onStatus(_handler: (s: DeliveryStatus) => void): void {
    throw new Error("not implemented — Fase 4/5");
  }
}
