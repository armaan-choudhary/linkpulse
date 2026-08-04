import { env } from '../config/env.js';

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const currentLevel = LOG_LEVELS[env.logLevel] ?? LOG_LEVELS.info;

function formatLog(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const logObj = {
    timestamp,
    level,
    message,
    ...meta
  };
  return JSON.stringify(logObj);
}

export const logger = {
  error(message, meta) {
    if (LOG_LEVELS.error <= currentLevel) {
      console.error(formatLog('error', message, meta));
    }
  },
  warn(message, meta) {
    if (LOG_LEVELS.warn <= currentLevel) {
      console.warn(formatLog('warn', message, meta));
    }
  },
  info(message, meta) {
    if (LOG_LEVELS.info <= currentLevel) {
      console.info(formatLog('info', message, meta));
    }
  },
  debug(message, meta) {
    if (LOG_LEVELS.debug <= currentLevel) {
      console.debug(formatLog('debug', message, meta));
    }
  }
};
