import { expect, type Page, test } from '@playwright/test';

async function login(page: Page) {
  await page.goto('/');
  await page.getByLabel('Work email').fill('admin@adops.test');
  await page.getByLabel('Password').fill('demo123');
  await page.getByRole('button', { name: 'Sign in' }).click();
}

test('shows the demo SaaS login screen before the workspace', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'AdOps Intelligence' })).toBeVisible();
  await expect(page.getByLabel('Work email')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
  await expect(page.getByText('admin@adops.test')).toBeVisible();
  await expect(page.getByText('demo123')).toBeVisible();
});

test('renders the AI revenue chat workspace', async ({ page }) => {
  await login(page);

  await expect(page.getByText('AdOps Intelligence')).toBeVisible();
  await expect(page.getByText('Shailesh Kumar')).toBeVisible();
  await expect(page.getByLabel('Signed in user').getByText('Workspace Admin')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Ask', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Act', exact: true })).toBeVisible();
  await expect(page.getByLabel('Connected project tools')).toBeVisible();
});

test('opens Act mode and project setup controls', async ({ page }) => {
  await login(page);

  await page.getByRole('button', { name: 'Act', exact: true }).click();
  await expect(page.getByText('Final approval required')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Review final approval' })).toBeVisible();

  await page.getByRole('button', { name: 'Project settings' }).click();
  await expect(page.getByLabel('Project setup')).toBeVisible();
  await expect(page.getByRole('button', { name: /Create new project/ })).toBeVisible();
});

test('opens the user module and returns to chat', async ({ page }) => {
  await login(page);

  await page.getByRole('button', { name: 'Users' }).click();

  await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'User' })).toBeVisible();
  await expect(page.getByText('Media Buyer')).toBeVisible();
  await expect(page.getByText('2 projects')).toBeVisible();

  await page.getByRole('button', { name: 'Back to AI chat' }).click();
  await expect(page.getByRole('heading', { name: 'How can I help with your campaigns?' })).toBeVisible();
});

test('opens project and connector management module', async ({ page }) => {
  await login(page);

  await page.getByRole('button', { name: 'Projects & connectors' }).click();

  await expect(page.getByRole('heading', { name: 'Project & Connector Management' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Crystal Hues PPC/ })).toBeVisible();
  await expect(page.getByLabel('Connector management').getByText('Google + Meta connected')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Crystal Hues PPC connectors' })).toBeVisible();
  await expect(page.getByRole('article').filter({ hasText: 'Google Ads' }).getByText('Read + draft actions')).toBeVisible();
  await expect(page.getByRole('article').filter({ hasText: 'Google Ads' }).getByText('read write with approval')).toBeVisible();
  await expect(page.getByRole('article').filter({ hasText: 'Meta Ads MCP' }).getByText('Ready to configure')).toBeVisible();
  await expect(page.getByRole('article').filter({ hasText: 'Meta Ads MCP' }).getByText('configured per project')).toBeVisible();

  await page.getByRole('button', { name: 'Lead Gen Test Needs connectors' }).click();
  await expect(page.getByRole('heading', { name: 'Lead Gen Test connectors' })).toBeVisible();
  await expect(page.getByText('No connectors configured')).toBeVisible();

  await page.getByRole('button', { name: 'Back to AI chat' }).click();
  await expect(page.getByRole('heading', { name: 'How can I help with your campaigns?' })).toBeVisible();
});

test('opens campaign architect for planning and campaign book export', async ({ page }) => {
  await login(page);

  await page.getByRole('button', { name: 'Campaign Architect' }).click();

  await expect(page.getByRole('heading', { name: 'Strategy an expert can trust. Execution a junior operator can follow.' })).toBeVisible();
  await expect(page.getByText('Questions before planning')).toBeVisible();
  await expect(page.getByText('Build-ready structure with expert logic')).toBeVisible();
  await expect(page.getByText('Campaign book sections')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Export campaign book' })).toBeVisible();
});

test('opens campaign intelligence dashboard with project scoped metrics', async ({ page }) => {
  await login(page);

  await page.getByRole('button', { name: 'Campaign intelligence' }).click();

  await expect(page.getByRole('heading', { name: 'Campaign Intelligence Dashboard' })).toBeVisible();
  await expect(page.getByText('Crystal Hues PPC')).toBeVisible();
  await expect(page.getByText('₹12.4L')).toBeVisible();
  await expect(page.getByText('3.36x', { exact: true })).toBeVisible();
  await expect(page.getByText('₹1,420')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Platform split' })).toBeVisible();
  await expect(page.getByRole('article').filter({ hasText: 'Brand search is carrying efficiency' }).getByText('Google Ads')).toBeVisible();
  await expect(page.getByRole('article').filter({ hasText: 'Prospecting fatigue is raising acquisition cost' }).getByText('Meta Ads')).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Campaign' })).toBeVisible();
  await expect(page.getByText('Brand Search - India')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Why performance changed' })).toBeVisible();
  await expect(page.getByText('ROAS dropped because Meta prospecting fatigue increased')).toBeVisible();
  await expect(page.getByText('High CPL alert')).toBeVisible();

  await page.getByRole('button', { name: 'Back to AI chat' }).click();
  await expect(page.getByRole('heading', { name: 'How can I help with your campaigns?' })).toBeVisible();
});

test('logs out of the demo SaaS session', async ({ page }) => {
  await login(page);

  await page.getByRole('button', { name: 'Logout' }).click();

  await expect(page.getByLabel('Work email')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
});
