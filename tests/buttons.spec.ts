import { test } from '../src/fixtures/fixtures';
import { expect } from '@playwright/test';

test('Buttons aaa-pattern', { tag: ['@e2e', '@aaa-pattern', '@buttons'] }, async ({ buttonsPage }) => {
  //arrange
  const messages = {
    click: 'Clicked: 1 times',
    doubleClick: 'Double clicked: 1 times',
    rightClick: 'Right clicked: 1 times',
  };

  await test.step('Click buttons', async ({}) => {
    //act
    await buttonsPage.clickMeButton.click();
    await buttonsPage.doubleClickMeButton.click({ clickCount: 2 });
    await buttonsPage.rightClickMeButton.click({ button: 'right' });
  });

  await test.step('Expect message with click count', async ({}) => {
    //assert
    await expect.soft(buttonsPage.clickMeMessage).toHaveText(messages.click);
    await expect.soft(buttonsPage.doubleClickMeMessage).toHaveText(messages.doubleClick);
    await expect.soft(buttonsPage.rightClickMeMessage).toHaveText(messages.rightClick);
  });
});

const buttons: {
  buttonName: string;
  action: 'clickMeButton' | 'doubleClickMeButton' | 'rightClickMeButton';
  clickCount: number;
  mouseButton: 'left' | 'right';
  expectAction: 'clickMeMessage' | 'doubleClickMeMessage' | 'rightClickMeMessage';
  expectMessage: string;
}[] = [
  {
    buttonName: 'One click button',
    action: 'clickMeButton',
    clickCount: 1,
    mouseButton: 'left',
    expectAction: 'clickMeMessage',
    expectMessage: 'Clicked: 1 times',
  },
  {
    buttonName: 'Double click button',
    action: 'doubleClickMeButton',
    clickCount: 2,
    mouseButton: 'left',
    expectAction: 'doubleClickMeMessage',
    expectMessage: 'Double clicked: 1 times',
  },
  {
    buttonName: 'Right click button',
    action: 'rightClickMeButton',
    clickCount: 1,
    mouseButton: 'right',
    expectAction: 'rightClickMeMessage',
    expectMessage: 'Right clicked: 1 times',
  },
];

for (const { buttonName, action, clickCount, mouseButton, expectAction, expectMessage } of buttons) {
  test(`For '${buttonName}' check is correct message '${expectMessage}'`, { tag: ['@e2e', '@ddt-pattern', '@buttons'] }, async ({ buttonsPage }) => {
    await test.step(`${buttonName}`, async () => {
      await buttonsPage[action].click({ clickCount: clickCount, button: mouseButton });
    });

    await test.step('Expect message with click count', async () => {
      await expect.soft(buttonsPage[expectAction]).toHaveText(expectMessage);
    });
  });
}
