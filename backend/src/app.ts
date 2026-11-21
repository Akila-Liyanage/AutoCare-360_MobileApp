import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { ENV } from './config/env.js';

import authRoutes from './routes/auth.routes.js';

const app: Application = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: ENV.CORS_ORIGIN }));
app.use(morgan(ENV.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/health', (_req: Request, res: Response) => {
  const databaseConnected = mongoose.connection.readyState === 1;

  res.status(200).json({
    status: databaseConnected ? 'OK' : 'DEGRADED',
    message: 'AutoCare 360 Backend API is running',
    database: databaseConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Authentication & Keycloak Routes
app.use(authRoutes);

// 404 Route Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found on this server.',
  });
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server Error]', err);
  res.status(500).json({
    error: 'InternalServerError',
    message: ENV.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
  });
});

export default app;
