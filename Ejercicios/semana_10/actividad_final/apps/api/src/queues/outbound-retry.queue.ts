import { Queue, Worker, type Job } from "bullmq";
import type { MessagingProvider } from "@app/shared";
import { redisConnection } from "../lib/redis.js";
import { prisma } from "../db/index.js";
import { emitToChatRoom } from "../ws/io-registry.js";

const QUEUE_NAME = "outbound-message-retry";
const MAX_ATTEMPTS = 5;

export interface OutboundRetryJobData {
  messageId: string;
  chatId: string;
  to: string;
  kind: "text" | "media";
  body?: string;
  mediaUrl?: string;
  mimeType?: string;
  mediaKind?: "image" | "audio" | "document";
}

export const outboundRetryQueue = new Queue<OutboundRetryJobData>(QUEUE_NAME, {
  connection: redisConnection,
});

export async function enqueueOutboundRetry(data: OutboundRetryJobData): Promise<void> {
  await outboundRetryQueue.add("retry-send", data, {
    attempts: MAX_ATTEMPTS,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: true,
    removeOnFail: false,
  });
}

export function createOutboundRetryWorker(provider: MessagingProvider): Worker<OutboundRetryJobData> {
  const worker = new Worker<OutboundRetryJobData>(
    QUEUE_NAME,
    async (job: Job<OutboundRetryJobData>) => {
      const { messageId, kind, to, body, mediaUrl, mimeType, mediaKind } = job.data;
      const result =
        kind === "text"
          ? await provider.sendText(to, body ?? "")
          : await provider.sendMedia(to, {
              kind: mediaKind ?? "document",
              url: mediaUrl ?? "",
              mimeType: mimeType ?? "application/octet-stream",
            });

      await prisma.message.update({
        where: { id: messageId },
        data: { providerMessageId: result.providerMessageId, deliveryStatus: "sent" },
      });

      emitToChatRoom(job.data.chatId, "message:status", {
        messageId,
        deliveryStatus: "sent",
      });
    },
    { connection: redisConnection },
  );

  worker.on("failed", (job, err) => {
    if (!job) return;
    const attemptsExhausted = job.attemptsMade >= (job.opts.attempts ?? MAX_ATTEMPTS);
    if (attemptsExhausted) {
      void prisma.message
        .update({
          where: { id: job.data.messageId },
          data: { deliveryStatus: "failed" },
        })
        .then(() => {
          emitToChatRoom(job.data.chatId, "message:status", {
            messageId: job.data.messageId,
            deliveryStatus: "failed",
            error: err?.message,
          });
        });
    }
  });

  return worker;
}
