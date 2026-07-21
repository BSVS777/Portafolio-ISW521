# WhatsApp Sender con arquitectura hexagonal

Aplicacion local para vincular una cuenta de WhatsApp con Baileys y enviar mensajes a numeros reales desde una UI web.

## Arquitectura

- `src/domain`: reglas puras del dominio (`PhoneNumber`, `Message`).
- `src/application`: casos de uso (`SendWhatsAppMessage`, `GetWhatsAppStatus`) y puertos (`MessageGateway`, `ConnectionGateway`).
- `src/infrastructure/whatsapp`: adaptador Baileys que implementa el puerto de mensajeria.
- `src/infrastructure/http`: API Express, archivos estaticos y eventos SSE.

El dominio no importa Express, Baileys ni dependencias externas. La aplicacion depende de puertos por inyeccion de dependencias, y la infraestructura contiene los detalles externos.

## Instalacion

```bash
npm install
```

## Uso

```bash
npm start
```

Abre `http://localhost:3000`, espera el QR, escanealo desde WhatsApp > Dispositivos vinculados y envia a un numero con codigo de pais, por ejemplo `50688887777`.

La sesion queda guardada en `auth/baileys`, por lo que no tendras que escanear el QR en cada reinicio mientras WhatsApp mantenga el dispositivo vinculado.

## API

- `GET /api/status`: estado de la conexion y QR si aplica.
- `POST /api/messages`: envia `{ "to": "50688887777", "message": "Hola" }`.
- `GET /api/events`: eventos SSE de estado y mensajes entrantes.

## Pruebas

```bash
npm test
```

## Nota de uso

Baileys usa WhatsApp Web y requiere una cuenta real vinculada con QR antes de enviar mensajes. Usa la herramienta con consentimiento del destinatario y evita automatizaciones masivas o spam.