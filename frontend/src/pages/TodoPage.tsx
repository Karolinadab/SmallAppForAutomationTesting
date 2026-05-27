import { useEffect, useState } from 'react';

import { createTodo, deleteTodo, getTodos, updateTodo } from '../api/client';
import { TodoForm } from '../components/TodoForm';
import { TodoList } from '../components/TodoList';
import type { Todo, TodoPayload, User } from '../types';

type TodoPageProps = {
  token: string;
  user: User;
  onLogout: () => void;
};

function getTodayDateString(): string {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const localDate = new Date(today.getTime() - offset * 60_000);
  return localDate.toISOString().slice(0, 10);
}

export function TodoPage({ token, user, onLogout }: TodoPageProps) {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState<boolean>(true);
  const [savingTodo, setSavingTodo] = useState<boolean>(false);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    async function loadTodos() {
      setLoadingTodos(true);
      setError('');

      try {
        const items = await getTodos(token, selectedDate);
        if (isMounted) {
          setTodos(items);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError instanceof Error ? requestError.message : 'Could not load TODOs');
        }
      } finally {
        if (isMounted) {
          setLoadingTodos(false);
        }
      }
    }

    void loadTodos();

    return () => {
      isMounted = false;
    };
  }, [selectedDate, token]);

  async function handleSaveTodo(payload: TodoPayload) {
    setSavingTodo(true);
    setError('');

    try {
      if (editingTodo) {
        const updatedTodo = await updateTodo(token, editingTodo.id, payload);
        setTodos((current) => current.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)));
        setEditingTodo(null);
        return;
      }

      const newTodo = await createTodo(token, payload);
      setTodos((current) => [...current, newTodo]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not save TODO');
    } finally {
      setSavingTodo(false);
    }
  }

  async function handleDeleteTodo(todoId: number) {
    setDeletingTodoId(todoId);
    setError('');

    try {
      await deleteTodo(token, todoId);
      setTodos((current) => current.filter((todo) => todo.id !== todoId));
      if (editingTodo?.id === todoId) {
        setEditingTodo(null);
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not delete TODO');
    } finally {
      setDeletingTodoId(null);
    }
  }

  return (
    <main className="app-layout">
      <header className="panel toolbar">
        <div>
          <p className="eyebrow">Logged in user</p>
          <h1 data-testid="user-greeting">Hello, {user.username}</h1>
        </div>

        <div className="toolbar-actions">
          <label className="field compact-field">
            <span>Selected date</span>
            <input
              data-testid="selected-date-input"
              type="date"
              value={selectedDate}
              onChange={(event) => {
                setSelectedDate(event.target.value);
                setEditingTodo(null);
              }}
            />
          </label>
          <button type="button" className="secondary-button" onClick={onLogout}>
            Log out
          </button>
        </div>
      </header>

      {error ? (
        <p className="error-banner" data-testid="todo-error">
          {error}
        </p>
      ) : null}

      <section className="content-grid">
        <TodoForm
          selectedDate={selectedDate}
          editingTodo={editingTodo}
          loading={savingTodo}
          onSubmit={handleSaveTodo}
          onCancelEdit={() => setEditingTodo(null)}
        />

        {loadingTodos ? (
          <section className="panel">
            <h2>TODO items</h2>
            <p className="muted">Loading TODOs...</p>
          </section>
        ) : (
          <TodoList todos={todos} onEdit={setEditingTodo} onDelete={handleDeleteTodo} deletingTodoId={deletingTodoId} />
        )}
      </section>
    </main>
  );
}