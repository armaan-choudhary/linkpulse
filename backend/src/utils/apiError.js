export class ApiError extends Error {
  constructor(statusCode, code, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, details = null) {
    return new ApiError(400, 'VALIDATION_ERROR', message, details);
  }

  static notFound(message = 'Short link not found') {
    return new ApiError(404, 'NOT_FOUND', message);
  }

  static rateLimited(message = 'Too many requests, please try again later') {
    return new ApiError(429, 'RATE_LIMITED', message);
  }

  static internal(message = 'An unexpected internal error occurred') {
    return new ApiError(500, 'INTERNAL_ERROR', message);
  }
}
