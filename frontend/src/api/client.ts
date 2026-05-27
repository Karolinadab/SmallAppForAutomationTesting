import type { Todo, TodoPayload, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  token?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    let message = 'Request failed';
    try {
      const data = (await response.json()) as { detail?: string };
      if (typeof data.detail === 'string') {
        message = data.detail;
      }
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function login(username: string, password: string): Promise<string> {
  const body = new URLSearchParams({ username, password });
  const response = await fetch(`${API_BASE_URL}/api/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    const data = (await response.json()) as { detail?: string };
    throw new Error(data.detail || 'Login failed');
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

export function getCurrentUser(token: string): Promise<User> {
  return request<User>('/api/auth/me', { token });
}

export function getTodos(token: string, dueDate: string): Promise<Todo[]> {
  const searchParams = new URLSearchParams({ due_date: dueDate });
  return request<Todo[]>(`/api/todos?${searchParams.toString()}`, { token });
}

export function createTodo(token: string, payload: TodoPayload): Promise<Todo> {
  return request<Todo>('/api/todos', {
    method: 'POST',
    token,
    body: payload,
  });
}

export function updateTodo(token: string, todoId: number, payload: TodoPayload): Promise<Todo> {
  return request<Todo>(`/api/todos/${todoId}`, {
    method: 'PUT',
    token,
    body: payload,
  });
}

export function deleteTodo(token: string, todoId: number): Promise<void> {
  return request<void>(`/api/todos/${todoId}`, {
    method: 'DELETE',
    token,
  });
}