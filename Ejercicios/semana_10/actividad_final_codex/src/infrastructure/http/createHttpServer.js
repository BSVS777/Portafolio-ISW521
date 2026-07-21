import cors from 'cors';
import express from 'express';
import { AppError } from '../../shared/AppError.js';
import { registerSse } from './sse.js';

export function createHttpServer({ useCases, eventBus, publicDir }) {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '64kb' }));
  app.use(express.static(publicDir));

  app.get('/api/status', (_req, res) => {
    res.json(useCases.getWhatsAppStatus.execute());
  });

  app.post('/api/messages', async (req, res, next) => {
    try {
      const result = await useCases.sendWhatsAppMessage.execute(req.body);
      res.status(202).json(result);
    } catch (error) {
      next(error);
    }
  });

  registerSse(app, eventBus, () => useCases.getWhatsAppStatus.execute());

  app.use((error, _req, res, _next) => {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        code: error.code,
        message: error.message,
      });
      return;
    }

    console.error(error);
    res.status(500).json({
      code: 'INTERNAL_ERROR',
      message: 'Error interno del servidor.',
    });
  });

  return app;
}