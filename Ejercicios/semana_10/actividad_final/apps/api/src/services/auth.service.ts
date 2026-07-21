import bcrypt from "bcryptjs";
import { prisma } from "../db/index.js";
import { AppError } from "../lib/errors.js";
import { signAccessToken } from "../lib/jwt.js";
import { toUserDTO } from "../lib/serializers.js";
import type { LoginResponse } from "@app/shared";

export async function login(phone: string, password: string): Promise<LoginResponse> {
  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user?.passwordHash) {
    throw new AppError(401, "Invalid credentials");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new AppError(401, "Invalid credentials");
  }

  const token = signAccessToken(user.id);
  return { token, user: toUserDTO(user) };
}
