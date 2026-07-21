import { AppError } from '../shared/AppError.js';

export class Message {
  constructor(text) {
    const normalized = String(text ?? '').trim();

    if (!normalized) {
      throw new AppError('El mensaje no puede estar vacio.', 422, 'EMPTY_MESSAGE');
    }

    if (normalized.length > 4096) {
      throw new AppError('El mensaje no puede superar 4096 caracteres.', 422, 'MESSAGE_TOO_LONG');
    }

    this.text = normalized;
  }

  toString() {
    return this.text;
  }
}