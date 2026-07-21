import type { FastifyInstance } from "fastify";
import { loginRequestSchema } from "@app/shared";
import * as authService from "../services/auth.service.js";

export default async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post("/auth/login", async (request, reply) => {
    const { phone, password } = loginRequestSchema.parse(request.body);
    const result = await authService.login(phone, password);
    return reply.send(result);
  });
}
