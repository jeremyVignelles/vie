import { describe, it, expect } from 'vitest';
import { placeholder, VERSION } from './index';

describe('vie library', () => {
  it('should export placeholder function', () => {
    expect(placeholder()).toBe('vie library - to be implemented');
  });

  it('should export VERSION constant', () => {
    expect(VERSION).toBe('1.0.0');
  });
});
