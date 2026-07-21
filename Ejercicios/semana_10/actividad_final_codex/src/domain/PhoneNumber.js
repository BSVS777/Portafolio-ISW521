import { AppError } from '../shared/AppError.js';

export class PhoneNumber {
  constructor(value) {
    const normalized = PhoneNumber.normalize(value);

    if (!/^\d{8,15}$/.test(normalized)) {
      throw new AppError(
        'El numero debe incluir codigo de pais y tener entre 8 y 15 digitos.',
        422,
        'INVALID_PHONE_NUMBER',
      );
    }

    this.value = normalized;
  }

  static normalize(value) {
    return String(value ?? '')
      .trim()
      .replace(/[^\d]/g, '');
  }

  toWhatsAppJid() {
    return `${this.value}@s.whatsapp.net`;
  }

  toString() {
    return this.value;
  }
}