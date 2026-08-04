import { ApiError } from '../utils/apiError.js';
import { logger } from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  const requestId = req.id || 'unknown';
  
  let statusCode = 500;
  let errorCode = 'INTERNAL_ERROR';
  let message = 'An unexpected internal error occurred';
  let details = null;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    errorCode = err.code;
    message = err.message;
    details = err.details;
  } else if (err.name === 'SyntaxError' && err.status === 400 && 'body' in err) {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = 'Invalid JSON request payload';
  } else {
    // Log unexpected errors
    logger.error('Unhandled Server Error', {
      requestId,
      method: req.method,
      url: req.originalUrl,
      errorName: err.name,
      errorMessage: err.message,
      stack: err.stack
    });
  }

  const payload = {
    error: {
      code: errorCode,
      message,
      ...(details ? { details } : {})
    },
    requestId
  };

  res.status(statusCode).json(payload);
}
