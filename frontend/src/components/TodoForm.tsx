import { useEffect, useState } from 'react';

import type { Todo, TodoPayload } from '../types';

type TodoFormProps = {
  selectedDate: string;
  editingTodo: Todo | null;
  loading: boolean;
  onSubmit: (payload: TodoPayload) => Promise<void>;
  onCancelEdit: () => void;
};

function buildInitialForm(selectedDate: string): TodoPayload {
  return {
    title: '',
    description: '',
    due_date: selectedDate,
    completed: false,
  };
}

export function TodoForm({ selectedDate, editingTodo, loading, onSubmit, onCancelEdit }: TodoFormProps) {
  const [formValues, setFormValues] = useState<TodoPayload>(buildInitialForm(selectedDate));

  useEffect(() => {
    if (editingTodo) {
      setFormValues({
        title: editingTodo.title,
        description: editingTodo.description,
        due_date: editingTodo.due_date,
        completed: editingTodo.completed,
      });
      return;
    }

    setFormValues(buildInitialForm(selectedDate));
  }, [editingTodo, selectedDate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({
      ...formValues,
      title: formValues.title.trim(),
      description: formValues.description?.trim() || null,
      due_date: selectedDate,
    });
  }

  return (
    <form className="panel form" onSubmit={handleSubmit}>
      <div className="panel-header">
        <h2>{editingTodo ? 'Edit TODO' : 'Add TODO'}</h2>
        {editingTodo ? (
          <button data-testid="cancel-edit-button" type="button" className="secondary-button" onClick={onCancelEdit}>
            Cancel edit
          </button>
        ) : null}
      </div>

      <label className="field">
        <span>Title</span>
        <input
          data-testid="todo-title-input"
          value={formValues.title}
          onChange={(event) => setFormValues((current) => ({ ...current, title: event.target.value }))}
          maxLength={120}
          required
        />
      </label>

      <label className="field">
        <span>Description</span>
        <textarea
          data-testid="todo-description-input"
          value={formValues.description || ''}
          onChange={(event) => setFormValues((current) => ({ ...current, description: event.target.value }))}
          rows={4}
          maxLength={500}
        />
      </label>

      <label className="checkbox-row">
        <input
          data-testid="todo-completed-input"
          type="checkbox"
          checked={formValues.completed}
          onChange={(event) => setFormValues((current) => ({ ...current, completed: event.target.checked }))}
        />
        <span>Completed</span>
      </label>

      <button data-testid="save-todo-button" type="submit" disabled={loading}>
        {loading ? 'Saving...' : editingTodo ? 'Save changes' : 'Add TODO'}
      </button>
    </form>
  );
}