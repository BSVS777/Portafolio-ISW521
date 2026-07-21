import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const ACCESS_TOKEN_TTL = "1h";

export function signAccessToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
}

export function verifyAccessToken(token: string): string {
  const payload = jwt.verify(token, env.JWT_SECRET);
  if (typeof payload === "string" || typeof payload.sub !== "string") {
    throw new Error("Invalid token payload");
  }
  return payload.sub;
}
