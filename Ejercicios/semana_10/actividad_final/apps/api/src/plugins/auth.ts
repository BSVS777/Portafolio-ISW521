import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { verifyAccessToken } from "../lib/jwt.js";

declare module "fastify" {
  interface FastifyRequest {
    userId: string;
  }
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export function registerAuthDecorator(app: FastifyInstance): void {
  app.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
    const header = request.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      await reply.code(401).send({ error: "Missing bearer token" });
      return;
    }
    try {
      request.userId = verifyAccessToken(header.slice("Bearer ".length));
    } catch {
      await reply.code(401).send({ error: "Invalid or expired token" });
    }
  });
}
