import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Message } from '../src/domain/Message.js';
import { PhoneNumber } from '../src/domain/PhoneNumber.js';

describe('PhoneNumber', () => {
  it('normalizes common phone input to digits', () => {
    const phone = new PhoneNumber('+506 8888-7777');

    assert.equal(phone.toString(), '50688887777');
    assert.equal(phone.toWhatsAppJid(), '50688887777@s.whatsapp.net');
  });

  it('rejects invalid phone numbers', () => {
    assert.throws(() => new PhoneNumber('123'), /codigo de pais/);
  });
});

describe('Message', () => {
  it('trims valid text', () => {
    assert.equal(new Message('  Hola  ').toString(), 'Hola');
  });

  it('rejects empty text', () => {
    assert.throws(() => new Message('   '), /vacio/);
  });
});