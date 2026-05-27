import { LoginForm } from '../components/LoginForm';
import type { LoginFormValues } from '../types';

type LoginPageProps = {
  loading: boolean;
  error: string;
  onLogin: (values: LoginFormValues) => Promise<void>;
};

export function LoginPage({ loading, error, onLogin }: LoginPageProps) {
  return (
    <main className="login-layout">
      <section className="hero-copy">
        <p className="eyebrow">Small full-stack learning project</p>
        <h1>Practice auth, CRUD, Docker, and Playwright in one app.</h1>
        <p>
          This demo keeps the code small on purpose. Each user sees only their own TODO items for the selected date.
        </p>
      </section>

      <LoginForm loading={loading} error={error} onSubmit={onLogin} />
    </main>
  );
}