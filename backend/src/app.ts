import cors from 'cors';
import express from 'express';
import { errorHandler } from './middlewares/errorHandler.js';
import { healthRoutes } from './routes/healthRoutes.js';
import { productRoutes } from './routes/productRoutes.js';

export function createApp() {
  const app = express();
  const configuredOrigin = process.env.CORS_ORIGIN;
  const allowedOrigins = new Set(['http://localhost:8080', 'http://localhost:5173']);

  if (configuredOrigin) {
    allowedOrigins.add(configuredOrigin);
  }

  app.use(
    cors({
      origin(origin, callback) {
        // Allow non-browser requests and local frontend origins in development.
        if (!origin || allowedOrigins.has(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error(`CORS blocked for origin: ${origin}`));
      },
    }),
  );
  app.use(express.json());

  app.use(healthRoutes);
  app.use('/api', productRoutes);
  app.use(errorHandler);

  return app;
}
