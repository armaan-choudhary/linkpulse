import { describe, it, expect } from 'vitest';
import { validateAndNormalizeUrl } from '../../src/validators/urlValidator.js';
import { ApiError } from '../../src/utils/ApiError.js';

describe('urlValidator', () => {
  it('accepts valid https URL', () => {
    const result = validateAndNormalizeUrl('https://example.com/products?item=bag');
    expect(result).toBe('https://example.com/products?item=bag');
  });

  it('accepts valid http URL', () => {
    const result = validateAndNormalizeUrl('http://example.org');
    expect(result).toBe('http://example.org/');
  });

  it('trims whitespace around valid URLs', () => {
    const result = validateAndNormalizeUrl('   https://example.com/path   ');
    expect(result).toBe('https://example.com/path');
  });

  it('throws VALIDATION_ERROR for empty or non-string input', () => {
    expect(() => validateAndNormalizeUrl('')).toThrow(ApiError);
    expect(() => validateAndNormalizeUrl(null)).toThrow(ApiError);
    expect(() => validateAndNormalizeUrl(123)).toThrow(ApiError);
  });

  it('throws VALIDATION_ERROR for relative URL', () => {
    expect(() => validateAndNormalizeUrl('/relative/path')).toThrow(ApiError);
  });

  it('throws VALIDATION_ERROR for javascript: scheme', () => {
    expect(() => validateAndNormalizeUrl('javascript:alert(1)')).toThrow(ApiError);
  });

  it('throws VALIDATION_ERROR for data: scheme', () => {
    expect(() => validateAndNormalizeUrl('data:text/plain;base64,SGVsbG8=')).toThrow(ApiError);
  });

  it('throws VALIDATION_ERROR for file: scheme', () => {
    expect(() => validateAndNormalizeUrl('file:///etc/passwd')).toThrow(ApiError);
  });

  it('throws VALIDATION_ERROR for URLs exceeding 2048 characters', () => {
    const longPath = 'a'.repeat(2050);
    expect(() => validateAndNormalizeUrl(`https://example.com/${longPath}`)).toThrow(ApiError);
  });
});
