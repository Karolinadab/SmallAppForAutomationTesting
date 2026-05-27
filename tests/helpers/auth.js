async function loginAndGetToken(request, options = {}) {
  const username = options.username || process.env.TEST_USERNAME || 'alice';
  const password = options.password || process.env.TEST_PASSWORD || 'alice123';
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8000';

  const response = await request.post(`${apiBaseUrl}/api/auth/token`, {
    form: {
      username,
      password,
    },
  });

  if (!response.ok()) {
    throw new Error(`Login failed with status ${response.status()}`);
  }

  const data = await response.json();
  return data.access_token;
}

module.exports = {
  loginAndGetToken,
};