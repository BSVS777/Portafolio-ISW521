import type {
  DeliveryStatus,
  InboundMessage,
  MediaPayload,
  MessagingProvider,
} from "@app/shared";

function randomLatencyMs(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Simulates a real WhatsApp-style provider on the other end.
 * Convention scoped to this mock only: since there is no real phone/session
 * concept, `to`/`from` addresses are just the chatId string.
 */
export class MockProvider implements MessagingProvider {
  private statusHandler: ((status: DeliveryStatus) => void) | undefined;
  private inboundHandler: ((msg: InboundMessage) => void) | undefined;

  async sendText(_to: string, _body: string): Promise<{ providerMessageId: string }> {
    await wait(randomLatencyMs(300, 900));
    const providerMessageId = crypto.randomUUID();
    void this.progressStatus(providerMessageId);
    return { providerMessageId };
  }

  async sendMedia(
    _to: string,
    _media: MediaPayload,
  ): Promise<{ providerMessageId: string }> {
    await wait(randomLatencyMs(300, 900));
    const providerMessageId = crypto.randomUUID();
    void this.progressStatus(providerMessageId);
    return { providerMessageId };
  }

  async markAsRead(_providerMessageId: string): Promise<void> {
    // Mock already progresses to "read" on its own timeline; nothing to do.
  }

  onInbound(handler: (msg: InboundMessage) => void): void {
    this.inboundHandler = handler;
  }

  onStatus(handler: (s: DeliveryStatus) => void): void {
    this.statusHandler = handler;
  }

  private async progressStatus(providerMessageId: string): Promise<void> {
    const timestamps: Array<DeliveryStatus["status"]> = ["sent", "delivered", "read"];
    for (const status of timestamps) {
      await wait(randomLatencyMs(300, 2000));
      this.statusHandler?.({
        providerMessageId,
        status,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Dev-only hook: simulates the other side replying. Not part of the
   * MessagingProvider interface — only reachable via /dev/mock/simulate-inbound.
   * `excludeUserId` is packed into `from` (as "<chatId>::<excludeUserId>") so the
   * handler can pick a sender other than whoever triggered this in the dev route.
   */
  async simulateInboundReply(chatId: string, body: string, excludeUserId: string): Promise<void> {
    await wait(randomLatencyMs(1000, 2000));
    this.inboundHandler?.({
      providerMessageId: crypto.randomUUID(),
      from: `${chatId}::${excludeUserId}`,
      body,
      receivedAt: new Date().toISOString(),
    });
  }
}
