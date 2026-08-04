import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

export async function connectDatabase(customUri) {
  const uri = customUri || env.mongodbUri;
  
  mongoose.set('strictQuery', true);
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    return conn;
  } catch (error) {
    // If in development mode and local MongoDB is unavailable (ECONNREFUSED), fall back to MongoMemoryServer automatically
    if (env.nodeEnv === 'development' && !customUri && (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED'))) {
      logger.warn('Local MongoDB daemon not detected at 127.0.0.1:27017. Falling back to in-memory MongoDB for local development...');
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongoMemory = await MongoMemoryServer.create();
        const memoryUri = mongoMemory.getUri();
        const conn = await mongoose.connect(memoryUri);
        logger.info(`Connected to in-memory MongoDB database`);
        return conn;
      } catch (memError) {
        logger.error(`Failed to start in-memory MongoDB: ${memError.message}`);
        throw error;
      }
    }
    
    logger.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
