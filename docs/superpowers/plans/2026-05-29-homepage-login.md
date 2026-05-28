# Homepage with Login Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the plain login screen with a restrained enterprise homepage that introduces AI PPC Operator and makes login the main action.

**Architecture:** Keep the current auth flow and workspace session model, but turn the login entry into a split-screen homepage. The left column sells the product with concise proof points and a compact preview of the operating model, while the right column holds the actual sign-in form. Implementation stays inside the existing frontend shell, with presentation handled by `LoginScreen.tsx` and `styles.css`, plus one e2e check to verify the new homepage and login behavior.

**Tech Stack:** React, TypeScript, Vite, Playwright, lucide-react, existing workspace auth API.

---

### Task 1: Rebuild the login screen as a homepage hero plus sign-in panel

**Files:**
- Modify: `frontend/src/components/LoginScreen.tsx`
- Test: `frontend/e2e/homepage-login.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { expect, test } from '@playwright/test';

test('renders the homepage hero and login as the main action', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'AI PPC Operator for serious campaign planning' })).toBeVisible();
  await expect(page.getByText('AI asks before it plans.')).toBeVisible();
  await expect(page.getByText('Google Ads and Meta Ads')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  await expect(page.getByLabel('Work email')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --workspace frontend exec playwright test e2e/homepage-login.spec.ts`
Expected: FAIL because the homepage hero heading and split layout do not exist yet.

- [ ] **Step 3: Write minimal implementation**

Create a split homepage inside the existing login component:

```tsx
<main className="login-shell homepage-shell">
  <section className="homepage-hero" aria-label="Product introduction">
    <div className="homepage-brand">
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
      <p>AI asks before it plans. Every recommendation carries logic, source, confidence, and risk.</p>
    </div>

    <ul className="homepage-proof-points">
      <li>Google Ads and Meta Ads</li>
      <li>Ask, Act, Architect</li>
      <li>Versioned campaign books</li>
      <li>Approval-safe execution</li>
    </ul>
  </section>

  <section className="login-panel homepage-login" aria-label="Workspace login">
    ...
  </section>
</main>
```

Keep the existing email/password state, submit handler, login error, and workspace credential hint.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --workspace frontend exec playwright test e2e/homepage-login.spec.ts`
Expected: PASS and the login form remains usable.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/LoginScreen.tsx frontend/e2e/homepage-login.spec.ts
git commit -m "feat: add homepage hero to login screen"
```

### Task 2: Add the homepage layout and enterprise styling

**Files:**
- Modify: `frontend/src/styles.css`

- [ ] **Step 1: Write the failing test**

Use the Task 1 e2e spec and add one viewport assertion if needed:

```ts
await page.setViewportSize({ width: 1440, height: 960 });
await expect(page.getByRole('heading', { name: 'AI PPC Operator for serious campaign planning' })).toBeVisible();
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --workspace frontend exec playwright test e2e/homepage-login.spec.ts`
Expected: FAIL if the split layout, spacing, or responsiveness is not styled yet.

- [ ] **Step 3: Write minimal implementation**

Add styles for:

```css
.homepage-shell {
  grid-template-columns: minmax(0, 1.15fr) minmax(360px, 460px);
  align-items: stretch;
  gap: 0;
  padding: 28px;
}

.homepage-hero {
  background: linear-gradient(180deg, #eff3f7 0%, #e9edf2 100%);
  border: 1px solid #d7e0ea;
  border-radius: 8px 0 0 8px;
  display: grid;
  gap: 24px;
  padding: 34px;
}

.homepage-login {
  border-radius: 0 8px 8px 0;
  box-shadow: none;
  max-width: none;
}

.homepage-proof-points {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  list-style: none;
  margin: 0;
  padding: 0;
}
```

Add mobile behavior so the hero stacks above the login panel and both remain readable at narrow widths.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run build && npm run lint && npm --workspace frontend exec playwright test e2e/homepage-login.spec.ts`
Expected: PASS with no overflow or clipped content at desktop and mobile widths.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/styles.css
git commit -m "feat: style homepage login split layout"
```

### Task 3: Verify the homepage still logs in and enters the workspace

**Files:**
- Modify: `frontend/e2e/revenue-chat.spec.ts`

- [ ] **Step 1: Write the failing test**

Add one assertion in the existing login test to check the new homepage copy before sign-in:

```ts
await expect(page.getByRole('heading', { name: 'AI PPC Operator for serious campaign planning' })).toBeVisible();
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --workspace frontend exec playwright test e2e/revenue-chat.spec.ts -g "shows the workspace login screen before the workspace"`
Expected: FAIL until the login screen is updated.

- [ ] **Step 3: Write minimal implementation**

Keep the login helper unchanged, preserve the workspace session behavior, and make sure the homepage still lands in the same authenticated workspace after sign-in.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run build && npm run lint && npm --workspace frontend run test:e2e`
Expected: PASS with the new homepage and the existing workspace tests still green.

- [ ] **Step 5: Commit**

```bash
git add frontend/e2e/revenue-chat.spec.ts
git commit -m "test: cover homepage login flow"
```

## Self-Review

- Spec coverage: homepage story, login action, layout, responsive behavior, and regression tests are all covered.
- Placeholder scan: no TBD/TODO items.
- Type consistency: component names, test file paths, and CSS class names are consistent across tasks.
- Scope check: one UI surface, one login flow, one regression suite. This is a single plan, not a decomposition candidate.
