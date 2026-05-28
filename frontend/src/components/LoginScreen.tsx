import { FormEvent, useState } from 'react';
import { BarChart3, FileText, LockKeyhole, Search, ShieldCheck, Sparkles, Target } from 'lucide-react';
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
    <main className="login-shell homepage-shell">
      <section className="homepage-hero" aria-label="Product introduction">
        <div className="login-brand homepage-brand">
          <div className="brand-mark-small">
            <Sparkles size={18} />
          </div>
          <div>
            <p>Campaign AI workspace</p>
            <h1>AI PPC Operator</h1>
          </div>
        </div>

        <div className="homepage-copy">
          <p className="eyebrow">Restraint-first campaign operations</p>
          <h2>AI PPC Operator for serious campaign planning</h2>
          <p>
            AI asks before it plans. Every recommendation carries logic, source, confidence, and risk. Execution stays
            behind approval, and every campaign book remains versioned and auditable.
          </p>
        </div>

        <ul className="homepage-proof-points" aria-label="Product proof points">
          <li>
            <Search size={16} />
            <span>Google Ads and Meta Ads</span>
          </li>
          <li>
            <BarChart3 size={16} />
            <span>Ask, Act, Architect</span>
          </li>
          <li>
            <FileText size={16} />
            <span>Versioned campaign books</span>
          </li>
          <li>
            <ShieldCheck size={16} />
            <span>Approval-safe execution</span>
          </li>
        </ul>

        <section className="homepage-preview" aria-label="Workspace preview">
          <article>
            <Target size={16} />
            <strong>Ask</strong>
            <span>Read connected account data and explain the problem.</span>
          </article>
          <article>
            <BarChart3 size={16} />
            <strong>Intelligence</strong>
            <span>Show metrics, citations, and source confidence.</span>
          </article>
          <article>
            <FileText size={16} />
            <strong>Architect</strong>
            <span>Turn strategy into a build-ready campaign book.</span>
          </article>
          <article>
            <ShieldCheck size={16} />
            <strong>Act</strong>
            <span>Draft changes and wait for approval before execution.</span>
          </article>
        </section>
      </section>

      <section className="login-panel homepage-login" aria-label="Workspace login">
        <div className="login-brand">
          <div className="brand-mark-small">
            <Sparkles size={18} />
          </div>
          <div>
            <p>Workspace access</p>
            <h1>Sign in</h1>
          </div>
        </div>

        <div className="login-copy">
          <h2>Open the workspace</h2>
          <p>Use the workspace account to review projects, AI reasoning, approvals, and campaign books.</p>
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
