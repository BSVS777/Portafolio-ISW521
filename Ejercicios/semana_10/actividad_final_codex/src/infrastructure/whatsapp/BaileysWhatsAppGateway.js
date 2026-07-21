import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import QRCode from 'qrcode';
import { AppError } from '../../shared/AppError.js';

export class BaileysWhatsAppGateway {
  constructor({ authDir = 'auth/baileys', eventBus }) {
    this.authDir = authDir;
    this.eventBus = eventBus;
    this.logger = pino({ level: process.env.LOG_LEVEL ?? 'silent' });
    this.socket = null;
    this.connecting = null;
    this.status = {
      connected: false,
      state: 'starting',
      qr: null,
      qrDataUrl: null,
      me: null,
      lastError: null,
    };
  }

  async connect() {
    if (this.connecting) return this.connecting;

    this.connecting = this.openSocket();

    try {
      await this.connecting;
    } finally {
      this.connecting = null;
    }
  }

  getStatus() {
    return { ...this.status };
  }

  async sendTextMessage({ to, message }) {
    if (!this.socket || !this.status.connected) {
      throw new AppError('WhatsApp no esta conectado. Escanea el QR primero.', 409, 'WHATSAPP_NOT_CONNECTED');
    }

    const sent = await this.socket.sendMessage(to.toWhatsAppJid(), {
      text: message.toString(),
    });

    return {
      id: sent?.key?.id ?? null,
      to: to.toString(),
      sentAt: new Date().toISOString(),
      status: 'sent',
    };
  }

  async openSocket() {
    const { state, saveCreds } = await useMultiFileAuthState(this.authDir);
    const { version } = await fetchLatestBaileysVersion();

    this.socket = makeWASocket({
      auth: state,
      browser: ['Actividad Final', 'Chrome', '1.0.0'],
      logger: this.logger,
      markOnlineOnConnect: false,
      version,
    });

    this.socket.ev.on('creds.update', saveCreds);

    this.socket.ev.on('connection.update', async (update) => {
      await this.handleConnectionUpdate(update);
    });

    this.socket.ev.on('messages.upsert', ({ messages }) => {
      for (const message of messages ?? []) {
        if (!message.key?.fromMe) {
          this.eventBus.emit('message.received', {
            from: message.key?.remoteJid,
            id: message.key?.id,
            at: new Date().toISOString(),
          });
        }
      }
    });
  }

  async handleConnectionUpdate(update) {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      this.status = {
        ...this.status,
        connected: false,
        state: 'qr',
        qr,
        qrDataUrl: await QRCode.toDataURL(qr),
        lastError: null,
      };
      this.eventBus.emit('whatsapp.status', this.getStatus());
    }

    if (connection === 'open') {
      this.status = {
        connected: true,
        state: 'connected',
        qr: null,
        qrDataUrl: null,
        me: this.socket?.user ?? null,
        lastError: null,
      };
      this.eventBus.emit('whatsapp.status', this.getStatus());
    }

    if (connection === 'close') {
      const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      this.status = {
        ...this.status,
        connected: false,
        state: shouldReconnect ? 'reconnecting' : 'logged_out',
        qr: null,
        qrDataUrl: null,
        lastError: lastDisconnect?.error?.message ?? 'Conexion cerrada',
      };
      this.eventBus.emit('whatsapp.status', this.getStatus());

      if (shouldReconnect) {
        setTimeout(() => {
          this.connect().catch((error) => {
            this.status = {
              ...this.status,
              state: 'error',
              lastError: error.message,
            };
            this.eventBus.emit('whatsapp.status', this.getStatus());
          });
        }, 1500);
      }
    }
  }
}