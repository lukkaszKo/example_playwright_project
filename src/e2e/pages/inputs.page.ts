import { Locator, Page } from '@playwright/test';

export class InputsPage {
  private readonly page: Page;
  readonly pageTitle: Locator;
  readonly basicInput: Locator;
  readonly basicInputValue: Locator;
  readonly clearButton: Locator;
  readonly pasteButton: Locator;
  readonly emailInput: Locator;
  readonly emailValidation: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = this.page.getByTestId('page-title');
    this.basicInput = this.page.getByTestId('text-input');
    this.basicInputValue = this.page.getByTestId('input-value');
    this.clearButton = this.page.getByTestId('clear-button');
    this.pasteButton = this.page.getByTestId('paste-button');
    this.emailInput = this.page.getByTestId('email-input');
    this.emailValidation = this.page.getByTestId('email-validation');
  }
}
