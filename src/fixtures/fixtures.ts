import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { ButtonsPage } from '../pages/buttons.page';

type TestFixtures = {
  homePage: HomePage;
  buttonsPage: ButtonsPage;
};

export const test = base.extend<TestFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.gotoHomePage();
    await expect(homePage.practiceComponentsHeading).toBeVisible();
    await use(homePage);
  },
  buttonsPage: async ({ page, homePage }, use) => {
    const buttonsPage = new ButtonsPage(page);
    await homePage.buttonsLink.click();
    await use(buttonsPage);
  },
});
