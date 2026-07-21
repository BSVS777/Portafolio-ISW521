import type { MessagingProvider } from "@app/shared";
import type { MessagingProviderKind } from "../config/env.js";
import { MockProvider } from "./mock/mock-provider.js";
import { CloudApiProvider } from "./cloud-api/cloud-api-provider.js";
import { BaileysProvider } from "./baileys/baileys-provider.js";

export function createMessagingProvider(kind: MessagingProviderKind): MessagingProvider {
  switch (kind) {
    case "mock":
      return new MockProvider();
    case "cloud_api":
      return new CloudApiProvider();
    case "baileys":
      return new BaileysProvider();
  }
}
