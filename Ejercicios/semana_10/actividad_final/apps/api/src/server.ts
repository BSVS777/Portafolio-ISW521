import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { ZodError } from "zod";
import { env } from "./config/env.js";
import { AppError } from "./lib/errors.js";
import { registerAuthDecorator } from "./plugins/auth.js";
import { createMessagingProvider } from "./providers/factory.js";
import { setMessagingProvider } from "./providers/instance.js";
import { registerProviderHandlers } from "./services/message.service.js";
import { createOutboundRetryWorker } from "./queues/outbound-retry.queue.js";
import { createSocketServer } from "./ws/socket.js";
import { setIO } from "./ws/io-registry.js";
import authRoutes from "./routes/auth.routes.js";
import chatsRoutes from "./routes/chats.routes.js";
import messagesRoutes from "./routes/messages.routes.js";
import devRoutes from "./routes/dev.routes.js";
import type { MockProvider } from "./providers/mock/mock-provider.js";

const app = Fastify({ logger: true });

// Dev-permissive CORS so apps/web (Vite dev server, different origin/port) can
// call this API directly from the browser. Tighten origin for production.
await app.register(cors, { origin: true, credentials: true });

registerAuthDecorator(app);

app.setErrorHandler((err: Error & { statusCode?: number }, _request, reply) => {
  if (err instanceof AppError) {
    return reply.code(err.statusCode).send({ error: err.message });
  }
  if (err instanceof ZodError) {
    return reply.code(400).send({ error: "Validation failed", details: err.issues });
  }
  // Fastify's own errors (malformed body, bad content-type, etc.) already carry
  // the right client statusCode — only fall back to 500 for truly unknown errors.
  if (typeof err.statusCode === "number" && err.statusCode >= 400 && err.statusCode < 500) {
    return reply.code(err.statusCode).send({ error: err.message });
  }
  app.log.error(err);
  return reply.code(500).send({ error: "Internal server error" });
});

app.get("/health", async () => {
  return { status: "ok" };
});

const provider = createMessagingProvider(env.MESSAGING_PROVIDER);
setMessagingProvider(provider);
registerProviderHandlers(provider);
createOutboundRetryWorker(provider);

await app.register(authRoutes);
await app.register(chatsRoutes);
await app.register(messagesRoutes);

if (env.MESSAGING_PROVIDER === "mock") {
  // Guarded by the env check above: createMessagingProvider("mock") always
  // returns a MockProvider instance.
  await app.register(devRoutes, { provider: provider as MockProvider });
}

await app.ready();

const io = createSocketServer(app.server);
setIO(io);

app
  .listen({ port: env.PORT, host: "0.0.0.0" })
  .catch((err: unknown) => {
    app.log.error(err);
    process.exit(1);
  });
