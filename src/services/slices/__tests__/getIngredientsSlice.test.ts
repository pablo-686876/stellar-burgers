import { expect, test, describe } from '@jest/globals';
import reducer, { initialState, getIngredients } from '../getIngredientsSlice';

const mockIngredients = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    __v: 0
  }
];

describe('[getIngredientsSlice] получить список ингредиентов - асинхронные экшены', () => {
  test('getIngredients.fulfilled', () => {
    const initialStateTest = {
      ...initialState,
      ingridients: [],
      isIngredientsLoading: true,
      isInit: false
    };
    const action = getIngredients.fulfilled(
      mockIngredients,
      'test-fulfilled',
      undefined
    );
    const newState = reducer(initialStateTest, action);

    expect(newState.isInit).toBe(true);
    expect(newState.ingridients).toEqual(mockIngredients);
    expect(newState.isIngredientsLoading).toBe(false);
  });
  test('getIngredients.pending', () => {
    const initialStateTest = {
      ...initialState,
      isIngredientsLoading: false,
      error: 'error'
    };
    const action = getIngredients.pending('test-pending', undefined);
    const newState = reducer(initialStateTest, action);

    expect(newState.isIngredientsLoading).toBe(true);
    expect(newState.error).toBeNull();
  });
  test('getIngredients.rejected', () => {
    const initialStateTest = {
      ...initialState,
      isIngredientsLoading: true,
      isInit: false,
      error: null
    };
    const errorMessage = 'error';
    const action = getIngredients.rejected(
      new Error('Rejected'),
      'test-rejected',
      undefined,
      errorMessage
    );
    const newState = reducer(initialStateTest, action);

    expect(newState.isInit).toBe(true);
    expect(newState.isIngredientsLoading).toBe(false);
    expect(newState.error).toBe(errorMessage);
  });
  test('getIngredientsSlice - несуществующий экшен', () => {
    const initialStateTest = {
      ...initialState
    };
    const action = { type: 'UNKNOWN' };
    const newState = reducer(undefined, action);

    expect(newState).toEqual(initialStateTest);
  });
});
