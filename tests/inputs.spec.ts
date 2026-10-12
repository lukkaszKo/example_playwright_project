import { faker } from '@faker-js/faker';
import { test, expect } from '../src/e2e/fixtures/fixtures';

// AAA pattern
test.describe('Inputs page (AAA tests)', { tag: ['@e2e', '@inputs', '@aaa-pattern'] }, () => {
  test.describe('Placeholders', () => {
    test('Should display correct placeholders in basic and email inputs', { tag: '@functional' }, async ({ inputsPage }) => {
      // arrange
      const basicPlaceholder = 'Type here...';
      const emailPlaceholder = 'Enter your email';

      await test.step('Expect placeholders', async () => {
        // assert
        await expect(inputsPage.basicInput).toHaveAttribute('placeholder', basicPlaceholder);
        await expect(inputsPage.emailInput).toHaveAttribute('placeholder', emailPlaceholder);
      });
    });
  });

  test.describe('Highlight after click', () => {
    test('Should highlight basic input with focus ring after click', { tag: '@functional' }, async ({ inputsPage }) => {
      // arrange
      const expectedRing = 'rgb(13, 17, 23) 0px 0px 0px 2px, rgb(166, 85, 247) 0px 0px 0px 4px, rgba(0, 0, 0, 0) 0px 0px 0px 0px';

      await test.step('Click input', async () => {
        // act
        await inputsPage.basicInput.click();
      });

      await test.step('Expect focus and highlight', async () => {
        // assert
        await expect(inputsPage.basicInput).toBeFocused();
        await expect(inputsPage.basicInput).toHaveCSS('box-shadow', expectedRing);
      });
    });
  });

  test.describe('Typed value', () => {
    test('Should display typed value in current value message', { tag: '@functional' }, async ({ inputsPage }) => {
      // arrange
      const text = faker.lorem.words(2);

      await test.step('Type text into basic input', async () => {
        // act
        await inputsPage.basicInput.fill(text);
      });

      await test.step('Expect input value and message', async () => {
        // assert
        await expect(inputsPage.basicInput).toHaveValue(text);
        await expect(inputsPage.basicInputValue).toHaveText(`Current value: ${text}`);
      });
    });
  });

  test.describe('Clear button', () => {
    test('Should clear basic input after clicking Clear', { tag: '@functional' }, async ({ inputsPage }) => {
      // arrange
      const text = faker.lorem.word();
      await inputsPage.basicInput.fill(text);

      await test.step('Click Clear button', async () => {
        // act
        await inputsPage.clearButton.click();
      });

      await test.step('Expect empty input and message', async () => {
        // assert
        await expect(inputsPage.basicInput).toHaveValue('');
        await expect(inputsPage.basicInputValue).toHaveText('Current value:');
      });
    });
  });

  test.describe('Paste button', () => {
    test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

    test('Should paste clipboard content into basic input after clicking Paste', { tag: '@functional' }, async ({ page, inputsPage }) => {
      // arrange
      const text = faker.lorem.words(3);
      await page.evaluate((value) => navigator.clipboard.writeText(value), text);

      await test.step('Click Paste button', async () => {
        // act
        await inputsPage.pasteButton.click();
      });

      await test.step('Expect pasted value in input and message', async () => {
        // assert
        await expect(inputsPage.basicInput).toHaveValue(text);
        await expect(inputsPage.basicInputValue).toHaveText(`Current value: ${text}`);
      });
    });
  });

  test.describe('Email validation', () => {
    test('Should show "Yes" for valid email', { tag: '@functional' }, async ({ inputsPage }) => {
      // arrange
      const email = faker.internet.email();

      await test.step('Type valid email', async () => {
        // act
        await inputsPage.emailInput.fill(email);
      });

      await test.step('Expect email to be valid', async () => {
        // assert
        await expect(inputsPage.emailValidation).toHaveText('Email valid: Yes');
      });
    });

    test('Should show "No" for invalid email', { tag: '@functional' }, async ({ inputsPage }) => {
      // arrange
      const invalidEmail = faker.lorem.word();

      await test.step('Type invalid email', async () => {
        // act
        await inputsPage.emailInput.fill(invalidEmail);
      });

      await test.step('Expect email to be invalid', async () => {
        // assert
        await expect(inputsPage.emailValidation).toHaveText('Email valid: No');
      });
    });
  });
});
