import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { SendWhatsAppMessage } from '../src/application/SendWhatsAppMessage.js';

class FakeMessageGateway {
  calls = [];

  async sendTextMessage(payload) {
    this.calls.push(payload);
    return {
      id: 'fake-id',
      status: 'sent',
      to: payload.to.toString(),
    };
  }
}

describe('SendWhatsAppMessage', () => {
  it('validates command and sends through the injected gateway', async () => {
    const gateway = new FakeMessageGateway();
    const useCase = new SendWhatsAppMessage({ messageGateway: gateway });

    const result = await useCase.execute({
      to: '+506 8888-7777',
      message: '  Hola desde prueba  ',
    });

    assert.equal(result.status, 'sent');
    assert.equal(result.to, '50688887777');
    assert.equal(gateway.calls[0].to.toWhatsAppJid(), '50688887777@s.whatsapp.net');
    assert.equal(gateway.calls[0].message.toString(), 'Hola desde prueba');
  });
});