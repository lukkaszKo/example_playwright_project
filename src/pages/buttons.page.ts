import { Locator, Page } from '@playwright/test';

export class ButtonsPage {
  private readonly page: Page;

  readonly clickMeButton: Locator;
  readonly clickMeMessage: Locator;
  readonly doubleClickMeButton: Locator;
  readonly doubleClickMeMessage: Locator;
  readonly rightClickMeButton: Locator;
  readonly rightClickMeMessage: Locator;
  readonly mainContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.clickMeButton = this.page.getByRole('button', { name: 'Click me', exact: true });
    this.clickMeMessage = this.page.getByTestId('click-count');
    this.doubleClickMeButton = this.page.getByRole('button', { name: 'Double click me' });
    this.doubleClickMeMessage = this.page.getByTestId('double-click-count');
    this.rightClickMeButton = this.page.getByRole('button', { name: 'Right click me' });
    this.rightClickMeMessage = this.page.getByTestId('right-click-count');
    this.mainContainer = this.page.getByTestId('app-main-content');
  }

  async moveMouseAway() {
    await this.page.mouse.move(0, 0);
  }
}
