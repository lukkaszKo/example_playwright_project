import type { Locator, Page } from '@playwright/test';

export class HomePage {
  private readonly page: Page;
  readonly practiceComponentsHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.practiceComponentsHeading = this.page.getByRole('heading', { name: 'Practice Components' });
  }

  async gotoHomePage() {
    await this.page.goto('/');
  }
}
