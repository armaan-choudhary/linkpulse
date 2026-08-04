import { ApiError } from '../utils/ApiError.js';

export function validateAndNormalizeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw ApiError.badRequest('Property "url" is required and must be a string', [
      { field: 'url', message: 'Provide a valid URL string' }
    ]);
  }

  const trimmed = rawUrl.trim();

  if (trimmed.length > 2048) {
    throw ApiError.badRequest('URL exceeds maximum allowed length of 2048 characters', [
      { field: 'url', message: 'URL is too long (max 2048 characters)' }
    ]);
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(trimmed);
  } catch (err) {
    throw ApiError.badRequest('Invalid URL format', [
      { field: 'url', message: 'Provide an absolute http(s) URL' }
    ]);
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw ApiError.badRequest('Only http and https protocols are supported', [
      { field: 'url', message: 'URL scheme must be http or https' }
    ]);
  }

  return parsedUrl.href;
}
