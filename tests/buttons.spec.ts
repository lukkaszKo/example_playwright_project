import { test, expect } from '../src/e2e/fixtures/fixtures';

// AAA pattern
test.describe('Buttons page (AAA tests)', { tag: ['@e2e', '@buttons', '@aaa-pattern'] }, () => {
  test.describe('Click me button', () => {
    test('Should display click message with count 1 after single click', { tag: '@functional' }, async ({ buttonsPage }) => {
      // arrange
      const message = 'Clicked: 1 times';

      await test.step('Click button', async () => {
        // act
        await buttonsPage.clickMeButton.click();
      });

      await test.step('Expect message with click count', async () => {
        // assert
        await expect(buttonsPage.clickMeMessage).toHaveText(message);
      });
    });

    test('Should change background color of click me button on hover', { tag: '@functional' }, async ({ buttonsPage }) => {
      // arrange
      const expectedColorHover = 'rgba(166, 85, 247, 0.9)';

      await test.step('Hover over button', async () => {
        // act
        await buttonsPage.clickMeButton.hover();
      });

      await test.step('Expect hover background color', async () => {
        // assert
        await expect(buttonsPage.clickMeButton).toHaveCSS('background-color', expectedColorHover);
      });
    });
  });

  test.describe('Double click me button', () => {
    test('Should display double click message with count 1 after double click', { tag: '@functional' }, async ({ buttonsPage }) => {
      // arrange
      const message = 'Double clicked: 1 times';

      await test.step('Double click button', async () => {
        // act
        await buttonsPage.doubleClickMeButton.dblclick();
      });

      await test.step('Expect message with click count', async () => {
        // assert
        await expect(buttonsPage.doubleClickMeMessage).toHaveText(message);
      });
    });
  });

  test.describe('Right click me button', () => {
    test('Should display right click message with count 1 after right click', { tag: '@functional' }, async ({ buttonsPage }) => {
      // arrange
      const message = 'Right clicked: 1 times';

      await test.step('Right click button', async () => {
        // act
        await buttonsPage.rightClickMeButton.click({ button: 'right' });
      });

      await test.step('Expect message with click count', async () => {
        // assert
        await expect(buttonsPage.rightClickMeMessage).toHaveText(message);
      });
    });
  });
});

// Visual tests
test.describe('Buttons page (visual tests)', { tag: ['@e2e', '@buttons', '@visual-test'] }, () => {
  test('Should match baseline screenshot after clicking all buttons', async ({ buttonsPage }) => {
    await test.step('Click all buttons', async () => {
      // act
      await buttonsPage.clickMeButton.click();
      await buttonsPage.doubleClickMeButton.dblclick();
      await buttonsPage.rightClickMeButton.click({ button: 'right' });
      await buttonsPage.clickMeButton.hover();
    });

    await test.step('Move mouse away to remove hover state', async () => {
      await buttonsPage.moveMouseAway();
    });

    await test.step('Expect page to match baseline screenshot', async () => {
      // assert
      await expect(buttonsPage.mainContainer).toHaveScreenshot('buttons-page.png', {
        animations: 'disabled',
        threshold: 0.1,
      });
    });
  });
});

// DDT pattern
test.describe('Buttons page (data driven tests)', { tag: ['@e2e', '@ddt-pattern', '@buttons', '@functional'] }, () => {
  test.describe('Buttons click', () => {
    type Case = {
      name: string;
      button: 'clickMeButton' | 'doubleClickMeButton' | 'rightClickMeButton';
      message: 'clickMeMessage' | 'doubleClickMeMessage' | 'rightClickMeMessage';
      text: string;
      clickCount?: number;
      mouseButton?: 'left' | 'right';
    };

    const cases: Case[] = [
      { name: 'One click', button: 'clickMeButton', message: 'clickMeMessage', text: 'Clicked: 1 times' },
      { name: 'Double click', button: 'doubleClickMeButton', message: 'doubleClickMeMessage', text: 'Double clicked: 1 times', clickCount: 2 },
      { name: 'Right click', button: 'rightClickMeButton', message: 'rightClickMeMessage', text: 'Right clicked: 1 times', mouseButton: 'right' },
    ];
    for (const { name, button, message, text, clickCount = 1, mouseButton = 'left' } of cases) {
      test(`${name} shows '${text}'`, async ({ buttonsPage }) => {
        await buttonsPage[button].click({ clickCount: clickCount, button: mouseButton });
        await expect(buttonsPage[message]).toHaveText(text);
      });
    }
  });

  test.describe('Buttons CSS verification: background-color on hover', () => {
    type Case = {
      name: string;
      button: 'clickMeButton' | 'doubleClickMeButton' | 'rightClickMeButton';
      color?: string;
    };

    const cases: Case[] = [
      { name: 'One click', button: 'clickMeButton' },
      { name: 'Double click', button: 'doubleClickMeButton' },
      { name: 'Right click', button: 'rightClickMeButton' },
    ];
    for (const { name, button, color = 'rgba(166, 85, 247, 0.9)' } of cases) {
      test(`CSS: '${name}' button should have background-color '${color}' after hover`, async ({ buttonsPage }) => {
        await buttonsPage[button].hover();
        await expect(buttonsPage[button]).toHaveCSS('background-color', color);
      });
    }
  });
});
