import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.test.ts'], // only unit tests
    exclude: ['e2e/**', 'node_modules/**', '.next/**', 'dist/**'],
    environment: 'node',
    globals: true,
  },
});
