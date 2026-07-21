export class MessageGateway {
  async sendTextMessage() {
    throw new Error('MessageGateway.sendTextMessage must be implemented by an adapter.');
  }
}