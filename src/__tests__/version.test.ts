import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import { VERSION } from '../version';

const pkg = createRequire(import.meta.url)('../../package.json') as { version: string };

describe('VERSION', () => {
  it('matches the package.json version', () => {
    expect(VERSION).toBe(pkg.version);
  });

  it('is a non-empty string', () => {
    expect(typeof VERSION).toBe('string');
    expect(VERSION.length).toBeGreaterThan(0);
  });
});
