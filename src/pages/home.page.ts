import type { Locator, Page } from '@playwright/test';

export class HomePage {
  private readonly page: Page;
  readonly practiceComponentsHeading: Locator;
  readonly buttonsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.practiceComponentsHeading = this.page.getByRole('heading', { name: 'Practice Components' });
    this.buttonsLink = this.page.getByRole('link', { name: 'Buttons', exact: true });
  }

  async gotoHomePage() {
    await this.page.goto('/');
  }
}
