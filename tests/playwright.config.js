const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  testMatch: ['api/**/*.spec.js', 'ui/**/*.spec.js'],
  fullyParallel: false,
  retries: 0,
  timeout: 30000,
  reporter: 'list',
  use: {
    baseURL: process.env.UI_BASE_URL || 'http://localhost:5173',
    trace: 'retain-on-failure',
  },
});