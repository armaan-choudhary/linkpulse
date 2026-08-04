import { describe, it, expect } from 'vitest';
import { generateShortCode } from '../../src/utils/codeGenerator.js';

describe('codeGenerator', () => {
  it('generates a string of default length 6', () => {
    const code = generateShortCode();
    expect(typeof code).toBe('string');
    expect(code.length).toBe(6);
  });

  it('contains only URL-safe base62 characters', () => {
    for (let i = 0; i < 50; i++) {
      const code = generateShortCode();
      expect(code).toMatch(/^[A-Za-z0-9]{6}$/);
    }
  });

  it('generates distinct codes on consecutive calls', () => {
    const code1 = generateShortCode();
    const code2 = generateShortCode();
    expect(code1).not.toBe(code2);
  });
});
