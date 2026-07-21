import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js';

const API = {
  status: '/api/status',
  messages: '/api/messages',
  events: '/api/events',
};

createApp({
  data() {
    return {
      status: {
        connected: false,
        state: 'starting',
        qrDataUrl: null,
        me: null,
        lastError: null,
      },
      form: {
        to: '',
        message: '',
      },
      sending: false,
      events: [],
      error: '',
      success: '',
    };
  },

  computed: {
    canSend() {
      return this.status.connected && this.form.to.trim() && this.form.message.trim() && !this.sending;
    },
    connectionLabel() {
      const labels = {
        connected: 'Conectado',
        error: 'Error',
        logged_out: 'Sesion cerrada',
        qr: 'Escanea el QR',
        reconnecting: 'Reconectando',
        starting: 'Iniciando',
      };
      return labels[this.status.state] ?? 'Desconectado';
    },
    accountLabel() {
      return this.status.me?.name || this.status.me?.id || 'Sin cuenta vinculada';
    },
  },

  async mounted() {
    await this.refreshStatus();
    this.subscribeToEvents();
  },

  methods: {
    addEvent(text) {
      this.events.unshift({
        id: crypto.randomUUID(),
        text,
        at: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
      });
      this.events = this.events.slice(0, 8);
    },

    async refreshStatus() {
      const response = await fetch(API.status);
      this.status = await response.json();
    },

    subscribeToEvents() {
      const source = new EventSource(API.events);

      source.addEventListener('whatsapp.status', (event) => {
        this.status = JSON.parse(event.data);
      });

      source.addEventListener('message.received', (event) => {
        const payload = JSON.parse(event.data);
        this.addEvent(`Mensaje recibido desde ${payload.from}`);
      });

      source.onerror = () => {
        this.addEvent('Se perdio la conexion con los eventos del servidor.');
      };
    },

    async sendMessage() {
      if (!this.canSend) return;

      this.error = '';
      this.success = '';
      this.sending = true;

      try {
        const response = await fetch(API.messages, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: this.form.to,
            message: this.form.message,
          }),
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.message || 'No se pudo enviar el mensaje.');
        }

        this.success = `Mensaje enviado a ${payload.to}.`;
        this.addEvent(`Enviado a ${payload.to}`);
        this.form.message = '';
      } catch (error) {
        this.error = error.message;
      } finally {
        this.sending = false;
      }
    },
  },
}).mount('#app');