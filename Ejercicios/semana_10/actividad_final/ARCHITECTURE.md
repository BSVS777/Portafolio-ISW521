# Architecture Decisions — Fase 0

## 1. Frontend framework: React 19 + TypeScript + Vite

Elegido sobre Vue/Angular porque las tres piezas más exigentes del spec ya tienen
solución madura y probada en el ecosistema React:

- **Virtualización a 10k+ mensajes**: `@tanstack/react-virtual` — el más usado y
  con mejor soporte para listas de altura variable (mensajes cortos vs. largos,
  imágenes, audio).
- **Animación con `layoutId` / shared transitions**: Framer Motion es, hoy, el
  único de los tres ecosistemas con transiciones compartidas de esta calidad
  out-of-the-box (Vue Motion y Angular Animations no tienen equivalente directo
  a `layoutId`).
- **TanStack Query + Zustand**: nativos de React, evita adaptar wrappers.

Trade-off: Angular hubiera dado más estructura "de fábrica" (DI, RxJS) para un
backend-heavy team; no compensa acá porque el diferencial del producto es la
UI/animación, no la arquitectura de servicios del cliente.

## 2. Transporte realtime: Socket.IO (no `ws` puro)

Decisión, no pregunta: Socket.IO da de fábrica reconexión automática, rooms
(un room por chat = broadcast trivial a participantes) y fallback de
transporte. Reimplementar eso sobre `ws` puro es exactamente el tipo de código
que no vale la pena escribir a mano. El overhead de Socket.IO es aceptable para
el volumen de esta app (chat 1:1/grupos pequeños, no miles de conexiones/seg).

## 3. Colas y presencia: Redis + BullMQ

La cola offline con backoff exponencial (requisito explícito) se implementa con
BullMQ sobre Redis en vez de un backoff casero — backoff exponencial con jitter
ya resuelto, con reintentos, dead-letter y observabilidad incluida. Redis
también se usa como pub/sub para presencia (`online`/`last seen`) compartida
entre instancias del backend si se escala horizontalmente.

## 4. Storage de media: `StorageProvider` abstraído

Mismo patrón que `MessagingProvider`: interfaz `StorageProvider` con
`put(file): Promise<{url}>`. Implementación `LocalDiskProvider` en desarrollo,
`S3CompatibleProvider` (MinIO/R2) en producción. Evita acoplar el código de
mensajería a un backend de storage específico.

## 5. Auth: JWT + usuarios semilla (fuera de alcance: signup completo)

El spec no pide un sistema de registro/onboarding. Se implementa JWT simple
(login con teléfono/password) y se siembran usuarios de prueba en dev. Si más
adelante se necesita signup real (verificación de teléfono, recuperación de
contraseña), se agrega como fase aparte — no antes de que se pida.

## 6. Reconciliación optimista

Cada mensaje se crea en el cliente con un `tempId` (UUID v4). El server
persiste el mensaje real y responde por WebSocket con `{tempId, message}`; el
cliente reemplaza la entrada optimista por la definitiva. Mismo mecanismo sirve
para reconciliar el ACK que venga de `CloudApiProvider`/`BaileysProvider`
(vía `providerMessageId`).

---

## Esquema de datos (Prisma)

```prisma
model User {
  id          String   @id @default(uuid())
  displayName String
  avatarUrl   String?
  phone       String?  @unique
  status      String?
  lastSeenAt  DateTime?
  createdAt   DateTime @default(now())

  memberships ChatParticipant[]
  messages    Message[]
  reactions   Reaction[]
}

model Chat {
  id        String   @id @default(uuid())
  isGroup   Boolean  @default(false)
  title     String?
  avatarUrl String?
  createdAt DateTime @default(now())

  participants ChatParticipant[]
  messages     Message[]
}

model ChatParticipant {
  chatId            String
  userId            String
  role              String    @default("member") // "member" | "admin"
  pinnedAt          DateTime?
  lastReadMessageId String?
  joinedAt          DateTime  @default(now())

  chat Chat @relation(fields: [chatId], references: [id])
  user User @relation(fields: [userId], references: [id])

  @@id([chatId, userId])
}

model Message {
  id                String    @id @default(uuid())
  tempId            String?
  chatId            String
  senderId          String
  type              String    // "text" | "image" | "audio" | "document" | "system"
  body              String?
  mediaUrl          String?
  mediaMeta         Json?
  replyToId         String?
  providerMessageId String?   @unique
  deliveryStatus    String    @default("sending") // sending|sent|delivered|read|failed
  editedAt          DateTime?
  deletedForAll     Boolean   @default(false)
  createdAt         DateTime  @default(now())

  chat      Chat      @relation(fields: [chatId], references: [id])
  sender    User      @relation(fields: [senderId], references: [id])
  replyTo   Message?  @relation("Replies", fields: [replyToId], references: [id])
  replies   Message[] @relation("Replies")
  reactions Reaction[]

  @@index([chatId, createdAt])
}

model Reaction {
  id        String   @id @default(uuid())
  messageId String
  userId    String
  emoji     String
  createdAt DateTime @default(now())

  message Message @relation(fields: [messageId], references: [id])
  user    User    @relation(fields: [userId], references: [id])

  @@unique([messageId, userId, emoji])
}

model ProviderSession {
  id          String   @id @default(uuid())
  provider    String   // "cloud_api" | "baileys"
  label       String?
  credentials Json?    // encrypted at rest
  status      String   @default("disconnected")
  updatedAt   DateTime @updatedAt
}

model WebhookEvent {
  id          String    @id @default(uuid())
  provider    String
  rawPayload  Json
  processedAt DateTime?
  createdAt   DateTime  @default(now())
}
```

---

## Estructura de carpetas

```
actividad_final/
├── apps/
│   ├── web/                       # React 19 + Vite + TS
│   │   └── src/
│   │       ├── app/                # routes, providers, layout
│   │       ├── features/
│   │       │   ├── chat-list/
│   │       │   ├── conversation/
│   │       │   ├── composer/
│   │       │   ├── media/
│   │       │   └── settings/
│   │       ├── components/         # primitivas UI compartidas
│   │       ├── hooks/
│   │       ├── stores/             # zustand
│   │       ├── lib/                # query client, socket client
│   │       └── styles/
│   └── api/                       # Fastify + TS
│       ├── src/
│       │   ├── routes/
│       │   ├── ws/
│       │   ├── providers/
│       │   │   ├── mock/
│       │   │   ├── cloud-api/
│       │   │   └── baileys/
│       │   ├── storage/            # StorageProvider impls
│       │   ├── services/
│       │   ├── queues/             # BullMQ jobs
│       │   └── db/
│       └── prisma/
│           └── schema.prisma
├── packages/
│   └── shared/
│       └── src/
│           ├── messaging-provider.ts
│           ├── schemas/            # zod
│           └── types/
├── pnpm-workspace.yaml
└── package.json
```

---

## Cómo verificar esta fase

No hay código ejecutable todavía — es una fase de decisiones. Verificación:
revisar que el esquema de datos cubra todos los features del núcleo (mensajes,
reacciones, respuestas citadas, grupos, estados de entrega) y que la estructura
de carpetas separe limpiamente UI, dominio y proveedores intercambiables.
