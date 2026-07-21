import type { MessagingProvider } from "@app/shared";

let providerInstance: MessagingProvider | undefined;

export function setMessagingProvider(provider: MessagingProvider): void {
  providerInstance = provider;
}

export function getMessagingProvider(): MessagingProvider {
  if (!providerInstance) {
    throw new Error("Messaging provider not initialized");
  }
  return providerInstance;
}
