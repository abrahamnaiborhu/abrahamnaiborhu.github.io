import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  workers: 1,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4174', ...(process.env.CROSS_BROWSER === '1' ? {} : { channel: 'chrome' }) },
  ...(process.env.CROSS_BROWSER === '1' ? {
    testMatch: ['**/accessibility.spec.ts', '**/compatibility.spec.ts'],
    projects: [
      { name: 'chrome', use: { browserName: 'chromium' as const, channel: 'chrome' } },
      { name: 'firefox', use: { browserName: 'firefox' as const } },
      { name: 'webkit', use: { browserName: 'webkit' as const } },
    ],
  } : {}),
  webServer: [
    { command: 'npm run preview -- --host 127.0.0.1 --port 4174 --strictPort', url: 'http://127.0.0.1:4174', reuseExistingServer: false },
    { command: 'npm run dev -- --host 127.0.0.1 --port 5174 --strictPort', url: 'http://127.0.0.1:5174', reuseExistingServer: false },
  ],
});
