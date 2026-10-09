import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';

type TestFixtures = {
  homePage: HomePage;
};

export const test = base.extend<TestFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.gotoHomePage();
    await use(homePage);
  },
});
