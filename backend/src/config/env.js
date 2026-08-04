const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/url_shortener';
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const NODE_ENV = process.env.NODE_ENV || 'development';

export const env = {
  PORT: Number(PORT),
  MONGO_URI,
  BASE_URL,
  NODE_ENV,
  // Backward compatibility getters
  port: Number(PORT),
  mongodbUri: MONGO_URI,
  baseUrl: BASE_URL,
  nodeEnv: NODE_ENV
};
