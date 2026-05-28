import { expect, test } from '@playwright/test';

test('renders the homepage hero and login as the main action', async ({ page }) => {
  await page.goto('/');
  await page.setViewportSize({ width: 1440, height: 960 });

  await expect(page.getByRole('heading', { name: 'AI PPC Operator for serious campaign planning' })).toBeVisible();
  await expect(page.getByText('AI asks before it plans.')).toBeVisible();
  await expect(page.getByText('Google Ads and Meta Ads')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  await expect(page.getByLabel('Work email')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
});
