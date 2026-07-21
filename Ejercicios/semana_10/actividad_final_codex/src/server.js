import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SendWhatsAppMessage } from './application/SendWhatsAppMessage.js';
import { GetWhatsAppStatus } from './application/GetWhatsAppStatus.js';
import { EventBus } from './infrastructure/events/EventBus.js';
import { createHttpServer } from './infrastructure/http/createHttpServer.js';
import { BaileysWhatsAppGateway } from './infrastructure/whatsapp/BaileysWhatsAppGateway.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const port = Number(process.env.PORT ?? 3000);

const eventBus = new EventBus();
const whatsappGateway = new BaileysWhatsAppGateway({
  authDir: path.join(rootDir, 'auth', 'baileys'),
  eventBus,
});

const useCases = {
  getWhatsAppStatus: new GetWhatsAppStatus({ connectionGateway: whatsappGateway }),
  sendWhatsAppMessage: new SendWhatsAppMessage({ messageGateway: whatsappGateway }),
};

const app = createHttpServer({
  eventBus,
  publicDir: rootDir,
  useCases,
});

await whatsappGateway.connect();

app.listen(port, () => {
  console.log(`Servidor listo en http://localhost:${port}`);
  console.log('Escanea el QR de WhatsApp Web cuando aparezca en pantalla o en la UI.');
});