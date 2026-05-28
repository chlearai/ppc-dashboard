import { FormEvent, useState } from 'react';
import { LockKeyhole, Sparkles } from 'lucide-react';
import { WORKSPACE_EMAIL, WORKSPACE_PASSWORD } from '../data/workspaceAuth';

type LoginScreenProps = {
  error?: string;
  onLogin: (email: string, password: string) => Promise<void>;
};

export function LoginScreen({ error, onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState(WORKSPACE_EMAIL);
  const [password, setPassword] = useState(WORKSPACE_PASSWORD);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onLogin(email, password);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-shell">
      <section className="login-panel" aria-label="Workspace login">
        <div className="login-brand">
          <div className="brand-mark-small">
            <Sparkles size={18} />
          </div>
          <div>
            <p>Campaign AI workspace</p>
            <h1>AdOps Intelligence</h1>
          </div>
        </div>

        <div className="login-copy">
          <h2>Sign in to your PPC workspace</h2>
          <p>Use the workspace account to review auth, users, projects, and the AI campaign chat.</p>
        </div>

        <form className="login-form" onSubmit={submitLogin}>
          <label>
            Work email
            <input
              autoComplete="email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              value={email}
            />
          </label>

          <label>
            Password
            <input
              autoComplete="current-password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
          </label>

          {error && <p className="login-error">{error}</p>}

          <button disabled={isSubmitting} type="submit">
            <LockKeyhole size={16} />
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="workspace-credentials" aria-label="Workspace credentials">
          <span>Workspace account</span>
          <strong>{WORKSPACE_EMAIL}</strong>
          <strong>{WORKSPACE_PASSWORD}</strong>
        </div>
      </section>
    </main>
  );
}
