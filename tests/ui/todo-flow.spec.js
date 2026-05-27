const { test } = require('@playwright/test');

const { LoginPage } = require('../page-objects/login-page');
const { TodoPage } = require('../page-objects/todo-page');

function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, '0');
  const day = `${today.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

test('user can create, edit, and delete a TODO', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const todoPage = new TodoPage(page);
  const originalTitle = `UI todo ${Date.now()}`;
  const updatedTitle = `${originalTitle} updated`;

  await loginPage.open();
  await loginPage.login(process.env.TEST_USERNAME || 'alice', process.env.TEST_PASSWORD || 'alice123');
  await todoPage.expectLoggedIn(process.env.TEST_USERNAME || 'alice');

  await todoPage.setDate(getTodayDateString());
  await todoPage.addTodo(originalTitle, 'Created by Playwright UI test');
  await todoPage.expectTodoVisible(originalTitle);

  await todoPage.startEdit(originalTitle);
  await todoPage.saveEdit(updatedTitle, 'Updated by Playwright UI test', true);
  await todoPage.expectTodoVisible(updatedTitle);

  await todoPage.deleteTodo(updatedTitle);
  await todoPage.expectTodoNotVisible(updatedTitle);
});