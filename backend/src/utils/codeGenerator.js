import { customAlphabet } from 'nanoid';

// URL-safe base62 alphabet
const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const generate = customAlphabet(ALPHABET, 6);

export function generateShortCode(length = 6) {
  return customAlphabet(ALPHABET, length)();
}
