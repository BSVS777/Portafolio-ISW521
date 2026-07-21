import { z } from "zod";
import { userSchema } from "./user.schema.js";

export const loginRequestSchema = z.object({
  phone: z.string().min(1),
  password: z.string().min(1),
});

export const loginResponseSchema = z.object({
  token: z.string(),
  user: userSchema,
});
