const { expect } = require('@playwright/test');

class TodoPage {
  constructor(page) {
    this.page = page;
    this.dateInput = page.getByTestId('selected-date-input');
    this.titleInput = page.getByTestId('todo-title-input');
    this.descriptionInput = page.getByTestId('todo-description-input');
    this.completedCheckbox = page.getByTestId('todo-completed-input');
    this.saveButton = page.getByTestId('save-todo-button');
  }

  async expectLoggedIn(username) {
    await expect(this.page.getByTestId('user-greeting')).toContainText(username);
  }

  async setDate(value) {
    await this.dateInput.fill(value);
  }

  async addTodo(title, description) {
    await this.titleInput.fill(title);
    await this.descriptionInput.fill(description);
    if (await this.completedCheckbox.isChecked()) {
      await this.completedCheckbox.uncheck();
    }
    await this.saveButton.click();
  }

  todoCard(title) {
    return this.page.locator('.todo-card', { hasText: title }).first();
  }

  async expectTodoVisible(title) {
    await expect(this.todoCard(title)).toBeVisible();
  }

  async startEdit(title) {
    const card = this.todoCard(title);
    await card.getByRole('button', { name: 'Edit' }).click();
  }

  async saveEdit(title, description, completed) {
    await this.titleInput.fill(title);
    await this.descriptionInput.fill(description);

    if (completed) {
      await this.completedCheckbox.check();
    } else {
      await this.completedCheckbox.uncheck();
    }

    await this.saveButton.click();
  }

  async deleteTodo(title) {
    const card = this.todoCard(title);
    await card.getByRole('button', { name: 'Delete' }).click();
  }

  async expectTodoNotVisible(title) {
    await expect(this.todoCard(title)).toHaveCount(0);
  }
}

module.exports = {
  TodoPage,
};