import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import linkRoutes from './routes/link.routes.js';
import healthRoutes from './routes/health.routes.js';
import { redirectToDestination } from './controllers/link.controller.js';
import { errorHandler } from './middleware/error.middleware.js';
import { ApiError } from './utils/ApiError.js';
import { env } from './config/env.js';

const app = express();

// Security Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());

// Body Parser with payload limit
app.use(express.json({ limit: '10kb' }));

// Logging Middleware
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health Check Routes
app.use('/health', healthRoutes);
app.use('/api/v1/health', healthRoutes);

// API v1 Routes
app.use('/api/v1/links', linkRoutes);

// Short Code Redirect Route (e.g. GET /:shortCode)
app.get('/:shortCode', redirectToDestination);

// 404 Route Handler
app.use('*', (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found.`, 'NOT_FOUND'));
});

// Global Centralized Error Handler
app.use(errorHandler);

export default app;
