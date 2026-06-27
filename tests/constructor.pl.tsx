import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('tests/hars/ingredients.har', {
    url: '**/ingredients',
    update: false
  });
});

test.describe('Конструктор бургера', () => {
  test('Добавление ингредиентов в конструктор', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('ingredient-list')).toBeVisible();

    await expect(page.getByTestId('bun-order-placeholder')).toBeVisible();
    await expect(page.getByTestId('bun-order')).toHaveCount(0);

    const ingredientsList = page.getByTestId('ingredients-order');
    await expect(
      page.getByTestId('ingredients-order-placeholder')
    ).toBeVisible();
    await expect(ingredientsList.locator('li')).toHaveCount(0);

    // находим булку
    const Bun = page
      .getByTestId('ingredient-button')
      .filter({ hasText: /булка/i })
      .first();

    // находим основной ингредиент
    const Main = page
      .getByTestId('ingredient-button')
      .filter({ hasText: /филе|мясо|биокотлета/i })
      .first();

    // находим соус
    const Sauce = page
      .getByTestId('ingredient-button')
      .filter({ hasText: /соус/i })
      .first();

    const bunName = await Bun.getByTestId('ingredient-name').innerText();
    const mainName = await Main.getByTestId('ingredient-name').innerText();
    const sauceName = await Sauce.getByTestId('ingredient-name').innerText();

    //добавляем ингредиенты
    await Bun.locator('button').first().click();
    await Main.locator('button').first().click();
    await Sauce.locator('button').first().click();

    // проверяем наличие в конструкторе - количество и название ингредиентов
    await expect(ingredientsList.locator('li')).toHaveCount(2);
    await expect(ingredientsList).toContainText(mainName);
    await expect(ingredientsList).toContainText(sauceName);
    await expect(page.getByTestId('bun-order')).toHaveCount(1);
    await expect(page.getByTestId('bun-order')).toContainText(bunName);
  });
});

test.describe('Модальные окна', () => {
  test('Открытие/закрытие модального окна', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('ingredient-list')).toBeVisible();

    const ingredientItem = page.getByTestId('ingredient-button').first();

    const ingredientId =
      await ingredientItem.getAttribute('data-ingredient-id');

    const ingredientName = await ingredientItem
      .getByTestId('ingredient-name')
      .innerText();

    await ingredientItem.click();
    await page.waitForURL(/\/ingredients\/.+/);
    await expect(page).toHaveURL(new RegExp(`/ingredients/${ingredientId}`));

    await expect(page.getByTestId('modal')).toBeVisible();
    await page.waitForTimeout(500);
    await expect(page.getByTestId('modal')).toContainText(ingredientName);

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
