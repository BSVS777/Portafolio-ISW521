import { Message } from '../domain/Message.js';
import { PhoneNumber } from '../domain/PhoneNumber.js';

export class SendWhatsAppMessage {
  constructor({ messageGateway }) {
    this.messageGateway = messageGateway;
  }

  async execute(command) {
    const phoneNumber = new PhoneNumber(command?.to);
    const message = new Message(command?.message);

    return this.messageGateway.sendTextMessage({
      to: phoneNumber,
      message,
    });
  }
}