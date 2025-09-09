import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e', // only look under /e2e
  testMatch: /.*\.spec\.ts$/, // only *.spec.ts (ignore *.test.ts)
  // If you want PW to auto-run the dev server for you:
  // webServer: {
  //   command: "npm run dev",
  //   url: "http://localhost:3000",
  //   reuseExistingServer: true,
  // },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
  },
});
