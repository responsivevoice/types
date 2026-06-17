import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: '@responsivevoice/types',
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    globals: true,
    typecheck: {
      enabled: true,
      include: ['src/**/*.test.ts'],
    },
  },
});
