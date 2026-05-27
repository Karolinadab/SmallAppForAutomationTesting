const { test, expect } = require('@playwright/test');

test('login endpoint returns JWT token for valid credentials', async ({ request }) => {
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8000';

  const response = await request.post(`${apiBaseUrl}/api/auth/token`, {
    form: {
      username: process.env.TEST_USERNAME || 'alice',
      password: process.env.TEST_PASSWORD || 'alice123',
    },
  });

  expect(response.ok()).toBeTruthy();

  const data = await response.json();
  expect(typeof data.access_token).toBe('string');
  expect(data.token_type).toBe('bearer');
});