import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  displayName: z.string().min(1),
  avatarUrl: z.string().url().nullable().optional(),
  phone: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  lastSeenAt: z.string().datetime().nullable().optional(),
  createdAt: z.string().datetime(),
});
