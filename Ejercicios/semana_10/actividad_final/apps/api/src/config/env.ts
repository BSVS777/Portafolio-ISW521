function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export type MessagingProviderKind = "mock" | "cloud_api" | "baileys";

function resolveMessagingProvider(): MessagingProviderKind {
  const raw = process.env.MESSAGING_PROVIDER ?? "mock";
  if (raw === "mock" || raw === "cloud_api" || raw === "baileys") {
    return raw;
  }
  throw new Error(`Invalid MESSAGING_PROVIDER: ${raw}`);
}

export const env = {
  DATABASE_URL: requireEnv("DATABASE_URL"),
  REDIS_URL: requireEnv("REDIS_URL"),
  JWT_SECRET: requireEnv("JWT_SECRET"),
  PORT: Number(process.env.PORT ?? 3000),
  MESSAGING_PROVIDER: resolveMessagingProvider(),
};
