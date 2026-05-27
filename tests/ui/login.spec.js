const { test } = require('@playwright/test');

const { LoginPage } = require('../page-objects/login-page');
const { TodoPage } = require('../page-objects/todo-page');

test('user can log in from the UI', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const todoPage = new TodoPage(page);

  await loginPage.open();
  await loginPage.login(process.env.TEST_USERNAME || 'alice', process.env.TEST_PASSWORD || 'alice123');

  await todoPage.expectLoggedIn(process.env.TEST_USERNAME || 'alice');
});