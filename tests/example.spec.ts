import { expect } from '@playwright/test';
import { test } from '../src/fixtures';

test('Go to home page', async ({ homePage }) => {
  await expect(homePage.practiceComponentsHeading).toBeVisible();
});
