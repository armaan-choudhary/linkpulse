import app from './app.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { env } from './config/env.js';

let server;

async function startServer() {
  try {
    await connectDatabase();

    server = app.listen(env.PORT, () => {
      console.log(`[Server] Lnk API running on port ${env.PORT} (${env.NODE_ENV})`);
    });
  } catch (error) {
    console.error('[Server] Failed to start application server:', error);
    process.exit(1);
  }
}

async function gracefulShutdown(signal) {
  console.log(`[Server] ${signal} received. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      console.log('[Server] HTTP server closed.');
      await disconnectDatabase();
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

startServer();
