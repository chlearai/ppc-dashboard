import { expect, type Page, test } from '@playwright/test';

async function login(page: Page) {
  await page.goto('/');
  await page.getByLabel('Work email').fill('admin@adops.test');
  await page.getByLabel('Password').fill('adops123!');
  await page.getByRole('button', { name: 'Sign in' }).click();
}

test('shows the workspace login screen before the workspace', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'AI PPC Operator for serious campaign planning' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  await expect(page.getByLabel('Work email')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
  await expect(page.getByText('admin@adops.test')).toBeVisible();
  await expect(page.getByText('adops123!')).toBeVisible();
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
  await expect(page.getByRole('article').filter({ hasText: 'Google Ads' }).getByText('Not configured').first()).toBeVisible();
  await expect(
    page.getByRole('article').filter({ hasText: 'Google Ads' }).getByText('Connect Google Ads MCP or API credentials'),
  ).toBeVisible();
  await expect(page.getByRole('article').filter({ hasText: 'Meta Ads MCP' }).getByText('Not configured')).toBeVisible();
  await expect(page.getByRole('article').filter({ hasText: 'Meta Ads MCP' }).getByText('Connect a vetted Meta Ads MCP endpoint')).toBeVisible();
  const aiBrainCard = page.getByRole('article').filter({ hasText: 'AI Agent Brain' });
  await expect(aiBrainCard).toBeVisible();
  await expect(aiBrainCard.getByText(/Configured with|No provider selected|Not configured/)).toBeVisible();
  await expect(page.getByRole('article').filter({ hasText: 'AI Agent Brain' }).getByRole('button', { name: 'Claude' })).toBeVisible();
  await page.getByRole('button', { name: 'Claude' }).click();
  await expect(page.getByRole('article').filter({ hasText: 'AI Agent Brain' }).getByText('Configured with Claude')).toBeVisible();

  await page.getByRole('button', { name: 'Lead Gen Test Needs connectors' }).click();
  await expect(page.getByRole('heading', { name: 'Lead Gen Test connectors' })).toBeVisible();
  await expect(page.getByText('No connectors configured')).toBeVisible();

  await page.getByRole('button', { name: 'Crystal Hues PPC Google + Meta connected Ready for AI actions' }).click();
  await page.getByRole('button', { name: 'Back to AI chat' }).click();
  await expect(page.getByRole('heading', { name: 'How can I help with your campaigns?' })).toBeVisible();
  await expect(page.getByLabel('Connected project tools').getByText('Claude')).toBeVisible();
});

test('opens campaign architect for planning and campaign book export', async ({ page }) => {
  await login(page);

  await page.getByRole('button', { name: 'Campaign Architect' }).click();

  await expect(page.getByRole('heading', { name: 'Turn account signals into a build-ready campaign book.' })).toBeVisible();
  await expect(page.getByText('Campaign Architect', { exact: true })).toBeVisible();
  await expect(page.getByText('Questions before planning')).toBeVisible();
  await expect(page.getByText('Build-ready structure with expert logic')).toBeVisible();
  await expect(page.getByText('Campaign book sections')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Export campaign book' })).toBeVisible();
});

test('saves a campaign book version from Act mode and shows it in the architect audit trail', async ({ page }) => {
  await login(page);

  await page.getByRole('button', { name: 'Act', exact: true }).click();
  const saveResponsePromise = page.waitForResponse(
    (response) => response.url().includes('/api/campaign-books') && response.request().method() === 'POST',
  );
  await page.getByRole('button', { name: 'Approve and save campaign book' }).click();
  const saveResponse = await saveResponsePromise;
  const { campaignBook } = (await saveResponse.json()) as { campaignBook: { version: number } };

  await expect(page.getByText('Campaign book saved')).toBeVisible();

  await page.getByRole('button', { name: 'Campaign Architect' }).click();

  await expect(page.getByRole('heading', { name: 'Saved campaign books' })).toBeVisible();
  const savedBook = page.getByRole('article').filter({ hasText: `Version ${campaignBook.version}` });
  await expect(savedBook.getByText(`Version ${campaignBook.version}`, { exact: true })).toBeVisible();
  await expect(savedBook.getByText('Approved from Act mode')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Audit trail' })).toBeVisible();
  await expect(page.getByText('Campaign book saved', { exact: true }).first()).toBeVisible();
});

test('opens campaign intelligence dashboard with project scoped metrics', async ({ page }) => {
  await login(page);

  await page.getByRole('button', { name: 'Campaign intelligence' }).click();

  await expect(page.getByRole('heading', { name: 'Campaign Intelligence Dashboard' })).toBeVisible();
  await expect(page.getByText('Crystal Hues PPC')).toBeVisible();
  await expect(page.getByRole('article').filter({ hasText: 'Spend' }).getByText('₹12.4L', { exact: true })).toBeVisible();
  await expect(page.getByText('3.36x', { exact: true })).toBeVisible();
  await expect(page.getByText('₹1,420')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Platform split' })).toBeVisible();
  await expect(page.getByRole('article').filter({ hasText: 'Brand search is carrying efficiency' }).getByText('Google Ads')).toBeVisible();
  await expect(page.getByRole('article').filter({ hasText: 'Prospecting fatigue is raising acquisition cost' }).getByText('Meta Ads')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Source citations' })).toBeVisible();
  await expect(page.getByLabel('Source citations').getByRole('link', { name: 'Google Ads search reporting' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Campaign' })).toBeVisible();
  await expect(page.getByText('Brand Search - India')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Why performance changed' })).toBeVisible();
  await expect(
    page.getByText(
      'ROAS dropped because Meta prospecting fatigue increased and competitor search absorbed more spend without matching conversion quality.',
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.getByText('High CPL alert')).toBeVisible();

  await page.getByRole('button', { name: 'Back to AI chat' }).click();
  await expect(page.getByRole('heading', { name: 'How can I help with your campaigns?' })).toBeVisible();
});

test('logs out of the workspace session', async ({ page }) => {
  await login(page);

  await page.getByRole('button', { name: 'Logout' }).click();

  await expect(page.getByLabel('Work email')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
});
