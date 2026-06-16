import { test, expect } from '@playwright/test';

test.describe('Конструктор бургера', () => {
  test('Добавление ингредиентов в конструктор', async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/ingredients',
      update: false
    });

    await page.goto('/');
    await expect(page.getByTestId('ingredient-list')).toBeVisible();

    await expect(page.getByTestId('bun-order-placeholder')).toBeVisible();
    await expect(page.getByTestId('bun-order')).toHaveCount(0);

    const ingredientsList = page.getByTestId('ingredients-order');
    await expect(
      page.getByTestId('ingredients-order-placeholder')
    ).toBeVisible();
    await expect(ingredientsList.locator('li')).toHaveCount(0);

    //добавляем булку
    await page
      .getByTestId('ingredient-button')
      .filter({ hasText: /булка/i })
      .locator('button')
      .first()
      .click();

    //добавляем ингредиент
    await page
      .getByTestId('ingredient-button')
      .filter({ hasText: /филе|мясо|биокотлета/i })
      .locator('button')
      .first()
      .click();

    //добавляем соус
    await page
      .getByTestId('ingredient-button')
      .filter({ hasText: /соус/i })
      .locator('button')
      .first()
      .click();

    // проверяем наличие в конструкторе
    await expect(ingredientsList.locator('li')).toHaveCount(2);
    await expect(page.getByTestId('bun-order')).toHaveCount(1);
  });
});

test.describe('Модальные окна', () => {
  test('Открытие/закрытие модального окна', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('ingredient-list')).toBeVisible();

    const ingredientItem = page
      .getByTestId('ingredient-items')
      .locator('li')
      .first();
    const ingredientId = await ingredientItem.getAttribute('data-ingredient-id');

    await ingredientItem.click();
    await expect(page).toHaveURL(new RegExp(`/ingredients/${ingredientId}`));

    await expect(page.getByTestId('modal')).toBeVisible();
    await page.waitForTimeout(500);

    const modalCloseButton = page.getByTestId('modal-close-button');
    await modalCloseButton.click();
    await expect(page.getByTestId('modal')).not.toBeVisible();

    await ingredientItem.click();
    await page.waitForTimeout(500);
    const modalOverlay = page.getByTestId('modal-overlay');
    await modalOverlay.click({ position: { x: 10, y: 10 } });
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });
});

test.describe('Создание заказа', () => {
  test('Моковая авторизация и создание заказа', async ({ page, context }) => {
    const mockToken = 'token';
    await page.addInitScript((token) => {
      window.localStorage.setItem('refreshToken', token);
    }, mockToken);
    await context.addCookies([
      {
        name: 'accessToken',
        value: mockToken,
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.routeFromHAR('tests/hars/order.har', {
      url: '**/orders',
      update: false
    });
    await page.routeFromHAR('tests/hars/user.har', {
      url: '**/auth/user',
      update: false
    });

    await page.goto('/');
    await expect(page.getByTestId('ingredient-list')).toBeVisible();

    //добавляем булку
    await page
      .getByTestId('ingredient-button')
      .filter({ hasText: /булка/i })
      .locator('button')
      .first()
      .click();

    //добавляем ингредиент
    await page
      .getByTestId('ingredient-button')
      .filter({ hasText: /филе|мясо|биокотлета/i })
      .locator('button')
      .first()
      .click();

    //добавляем соус
    await page
      .getByTestId('ingredient-button')
      .filter({ hasText: /соус/i })
      .locator('button')
      .first()
      .click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();
    await expect(page.getByTestId('order-details')).toContainText('106553');

    await expect(page.getByTestId('bun-order-placeholder')).toBeVisible();
    await expect(
      page.getByTestId('ingredients-order-placeholder')
    ).toBeVisible();
    const modalCloseButton = page.getByTestId('modal-close-button');
    await modalCloseButton.click();
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });
});
