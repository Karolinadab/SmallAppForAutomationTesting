import { useState } from 'react';

import type { LoginFormValues } from '../types';

type LoginFormProps = {
  loading: boolean;
  error: string;
  onSubmit: (values: LoginFormValues) => Promise<void>;
};

const initialValues: LoginFormValues = {
  username: '',
  password: '',
};

export function LoginForm({ loading, error, onSubmit }: LoginFormProps) {
  const [values, setValues] = useState<LoginFormValues>(initialValues);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(values);
  }

  return (
    <form className="panel form" onSubmit={handleSubmit}>
      <div>
        <h1>Learning TODO App</h1>
        <p className="muted">Log in with a test user to see your own TODO items.</p>
      </div>

      <label className="field">
        <span>Username</span>
        <input
          data-testid="username-input"
          value={values.username}
          onChange={(event) => setValues((current) => ({ ...current, username: event.target.value }))}
          autoComplete="username"
          required
        />
      </label>

      <label className="field">
        <span>Password</span>
        <input
          data-testid="password-input"
          type="password"
          value={values.password}
          onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))}
          autoComplete="current-password"
          required
        />
      </label>

      {error ? (
        <p className="error-message" data-testid="login-error">
          {error}
        </p>
      ) : null}

      <button data-testid="login-button" type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Log in'}
      </button>
    </form>
  );
}