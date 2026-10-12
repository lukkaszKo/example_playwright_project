import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { ButtonsPage } from '../pages/buttons.page';
import { InputsPage } from '../pages/inputs.page';

type TestFixtures = {
  homePage: HomePage;
  buttonsPage: ButtonsPage;
  inputsPage: InputsPage;
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
    await expect(buttonsPage.clickMeButton).toBeVisible();
    await use(buttonsPage);
  },
  inputsPage: async ({ page, homePage }, use) => {
    const inputsPage = new InputsPage(page);
    await homePage.inputsLink.click();
    await expect(inputsPage.basicInput).toBeVisible();
    await use(inputsPage);
  },
});

export { expect };
