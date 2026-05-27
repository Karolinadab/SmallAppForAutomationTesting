import { useEffect, useState } from 'react';

import { getCurrentUser, login } from './api/client';
import { LoginPage } from './pages/LoginPage';
import { TodoPage } from './pages/TodoPage';
import { clearToken, getStoredToken, saveToken } from './lib/auth';
import type { LoginFormValues, User } from './types';

export default function App() {
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(token));
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const activeToken = token;

    let isMounted = true;

    async function loadUser() {
      setLoading(true);
      try {
        const currentUser = await getCurrentUser(activeToken);
        if (isMounted) {
          setUser(currentUser);
        }
      } catch {
        clearToken();
        if (isMounted) {
          setToken(null);
          setUser(null);
          setError('Session expired. Please log in again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadUser();

    return () => {
      isMounted = false;
    };
  }, [token]);

  async function handleLogin(values: LoginFormValues) {
    setError('');
    setLoading(true);

    try {
      const accessToken = await login(values.username, values.password);
      const currentUser = await getCurrentUser(accessToken);
      saveToken(accessToken);
      setToken(accessToken);
      setUser(currentUser);
    } catch (requestError) {
      clearToken();
      setToken(null);
      setUser(null);
      setError(requestError instanceof Error ? requestError.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    clearToken();
    setToken(null);
    setUser(null);
    setError('');
  }

  if (loading && !user) {
    return (
      <main className="centered-message">
        <p>Loading...</p>
      </main>
    );
  }

  if (!token || !user) {
    return <LoginPage loading={loading} error={error} onLogin={handleLogin} />;
  }

  return <TodoPage token={token} user={user} onLogout={handleLogout} />;
}