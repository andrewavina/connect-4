import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e', // only look at e2e tests
  testMatch: /.*\.spec\.ts$/, // avoid picking up Vitest unit tests
  fullyParallel: true, // fine locally; CI can override via WORKERS
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1, // flaky protection on CI
  reporter: 'html',

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    colorScheme: 'light',
    locale: 'en-US',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // add more browsers if/when you care:
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  // auto-run your dev server for e2e
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
