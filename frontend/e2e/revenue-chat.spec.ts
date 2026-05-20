import { expect, test } from '@playwright/test';

test('renders the AI revenue chat workspace', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('AdOps Intelligence')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Ask', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Act', exact: true })).toBeVisible();
  await expect(page.getByLabel('Connected project tools')).toBeVisible();
});

test('opens Act mode and project setup controls', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Act', exact: true }).click();
  await expect(page.getByText('Final approval required')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Review final approval' })).toBeVisible();

  await page.getByRole('button', { name: 'Project settings' }).click();
  await expect(page.getByLabel('Project setup')).toBeVisible();
  await expect(page.getByRole('button', { name: /Create new project/ })).toBeVisible();
});
