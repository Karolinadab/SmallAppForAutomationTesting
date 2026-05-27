const { test, expect } = require('@playwright/test');

const { loginAndGetToken } = require('../helpers/auth');

test('TODO endpoint works with JWT token', async ({ request }) => {
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8000';
  const token = await loginAndGetToken(request);
  const uniqueTitle = `API todo ${Date.now()}`;
  const dueDate = new Date().toISOString().slice(0, 10);

  const createResponse = await request.post(`${apiBaseUrl}/api/todos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      title: uniqueTitle,
      description: 'Created by Playwright API test',
      due_date: dueDate,
      completed: false,
    },
  });

  expect(createResponse.status()).toBe(201);
  const createdTodo = await createResponse.json();

  const listResponse = await request.get(`${apiBaseUrl}/api/todos?due_date=${dueDate}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  expect(listResponse.ok()).toBeTruthy();
  const todos = await listResponse.json();
  expect(todos.some((todo) => todo.id === createdTodo.id)).toBeTruthy();

  const deleteResponse = await request.delete(`${apiBaseUrl}/api/todos/${createdTodo.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  expect(deleteResponse.status()).toBe(204);
});