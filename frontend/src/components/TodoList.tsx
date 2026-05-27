import type { Todo } from '../types';

type TodoListProps = {
  todos: Todo[];
  onEdit: (todo: Todo) => void;
  onDelete: (todoId: number) => Promise<void>;
  deletingTodoId: number | null;
};

export function TodoList({ todos, onEdit, onDelete, deletingTodoId }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <section className="panel">
        <h2>TODO items</h2>
        <p className="muted">No TODOs for this date yet.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <h2>TODO items</h2>
      <ul className="todo-list" data-testid="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-card" data-testid={`todo-item-${todo.id}`}>
            <div>
              <div className="todo-title-row">
                <h3>{todo.title}</h3>
                {todo.completed ? <span className="badge">Done</span> : <span className="badge muted-badge">Open</span>}
              </div>
              <p>{todo.description || 'No description'}</p>
            </div>

            <div className="todo-actions">
              <button data-testid={`edit-todo-${todo.id}`} type="button" className="secondary-button" onClick={() => onEdit(todo)}>
                Edit
              </button>
              <button
                data-testid={`delete-todo-${todo.id}`}
                type="button"
                className="danger-button"
                disabled={deletingTodoId === todo.id}
                onClick={() => onDelete(todo.id)}
              >
                {deletingTodoId === todo.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}