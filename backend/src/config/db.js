import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

export async function connectDatabase(customUri) {
  const uri = customUri || env.MONGO_URI || env.mongodbUri;

  mongoose.set('strictQuery', true);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[Database] Connected to MongoDB at ${uri}`);
    return conn;
  } catch (error) {
    console.warn(`[Database] Could not connect to primary MongoDB (${error.message}). Starting in-memory database fallback...`);

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongoMemory = await MongoMemoryServer.create();
      const memoryUri = mongoMemory.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`[Database] Successfully connected to in-memory MongoDB database`);
      return conn;
    } catch (memError) {
      console.error(`[Database] Failed to start in-memory MongoDB fallback: ${memError.message}`);
      throw error;
    }
  }
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
