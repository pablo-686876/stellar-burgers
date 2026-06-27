jest.mock('@reduxjs/toolkit', () => {
  const actual = jest.requireActual('@reduxjs/toolkit');
  return {
    ...actual,
    nanoid: () => 'test-id'
  };
});

import { expect, test, describe } from '@jest/globals';

import reducer, {
  initialState,
  orderBurger,
  clearState,
  addOrderBun,
  addOrderIngredient,
  deleteOrderIngredient,
  moveOrderIngredientDown,
  moveOrderIngredientUp
} from '../constructorSlice';

const mockNewOrder = {
  ingredients: [
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
      _id: '643d69a5c3f7b9001cfa093e',
      name: 'Филе Люминесцентного тетраодонтимформа',
      type: 'main',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/meat-03.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
      __v: 0
    },
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
    }
  ],
  _id: '6a30146b6a172d001b98cbd2',
  owner: {
    name: 'pablo',
    email: 'd2881312@gmail.com',
    createdAt: '2026-06-09T21:35:38.201Z',
    updatedAt: '2026-06-10T11:50:04.213Z'
  },
  status: 'done',
  name: 'Люминесцентный краторный бургер',
  createdAt: '2026-06-15T15:04:11.224Z',
  updatedAt: '2026-06-15T15:04:11.290Z',
  number: 106502,
  price: 3498
};

const mockOrderBurger = [
  '643d69a5c3f7b9001cfa093c',
  '643d69a5c3f7b9001cfa093e',
  '643d69a5c3f7b9001cfa093c'
];

const mockBun = {
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
  __v: 0,
  id: 'test-id'
};

const mockAddBun = {
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
};

const mockOrderIngredients = [
  {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
    __v: 0,
    id: 'test-id'
  }
];

const mockAddOrderIngredient = {
  _id: '643d69a5c3f7b9001cfa093e',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
  __v: 0
};

const mockMoveUpIngredient = [
  {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
    __v: 0,
    id: 'test-id-1'
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
    __v: 0,
    id: 'test-id-2'
  }
];

const mockMoveDownIngredient = [
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
    __v: 0,
    id: 'test-id-2'
  },
  {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
    __v: 0,
    id: 'test-id-1'
  }
];

describe('[constructorSlice] конструктор бургера - обыкновенные экшены', () => {
  test('moveOrderIngredientUp - перемещение ингредиента вверх в кострукторе', () => {
    const initialStateTest = {
      ...initialState,
      orderIngredients: mockMoveDownIngredient
    };
    const newState = reducer(
      initialStateTest,
      moveOrderIngredientUp('test-id-1')
    );

    expect(newState.orderIngredients).toEqual(mockMoveUpIngredient);
  });
  test('moveOrderIngredientDown - перемещение ингредиента вниз в кострукторе', () => {
    const initialStateTest = {
      ...initialState,
      orderIngredients: mockMoveUpIngredient
    };
    const newState = reducer(
      initialStateTest,
      moveOrderIngredientDown('test-id-1')
    );

    expect(newState.orderIngredients).toEqual(mockMoveDownIngredient);
  });
  test('deleteOrderIngredient - удаление ингредиента из коструктора', () => {
    const initialStateTest = {
      ...initialState,
      orderIngredients: mockOrderIngredients
    };
    const newState = reducer(
      initialStateTest,
      deleteOrderIngredient('test-id')
    );

    expect(newState.orderIngredients).toEqual([]);
  });
  test('addOrderIngredient - добавление ингредиента в коструктор', () => {
    const initialStateTest = {
      ...initialState,
      orderIngredients: []
    };
    const newState = reducer(
      initialStateTest,
      addOrderIngredient(mockAddOrderIngredient)
    );

    expect(newState.orderIngredients).toEqual(mockOrderIngredients);
  });
  test('addOrderBun - добавление булки в коструктор', () => {
    const initialStateTest = {
      ...initialState,
      bun: null
    };
    const newState = reducer(initialStateTest, addOrderBun(mockAddBun));

    expect(newState.bun).toEqual(mockBun);
  });
  test('clearState - очищение состояния', () => {
    const initialStateTest = {
      ...initialState,
      orderBurger: mockNewOrder,
      orderError: 'error'
    };
    const newState = reducer(initialStateTest, clearState());

    expect(newState.orderBurger).toBeNull();
    expect(newState.orderError).toBeNull();
  });
  test('constructorSlice - несуществующий экшен', () => {
    const initialStateTest = {
      ...initialState
    };
    const action = { type: 'UNKNOWN' };
    const newState = reducer(undefined, action);

    expect(newState).toEqual(initialStateTest);
  });
});

describe('[constructorSlice] конструктор бургера - асинхронные экшены', () => {
  test('orderBurger.pending', () => {
    const initialStateTest = {
      ...initialState,
      isOrderLoading: false,
      orderError: 'error'
    };
    const action = orderBurger.pending('test-pending', mockOrderBurger);
    const newState = reducer(initialStateTest, action);

    expect(newState.isOrderLoading).toBe(true);
    expect(newState.orderError).toBeNull();
  });
  test('orderBurger.fulfilled', () => {
    const initialStateTest = {
      ...initialState,
      orderIngredients: mockOrderIngredients,
      bun: mockBun,
      isOrderLoading: true,
      orderBurger: null
    };
    const action = orderBurger.fulfilled(
      mockNewOrder,
      'test-fulfilled',
      mockOrderBurger
    );
    const newState = reducer(initialStateTest, action);

    expect(newState.isOrderLoading).toBe(false);
    expect(newState.bun).toBeNull();
    expect(newState.orderIngredients).toEqual([]);
    expect(newState.orderBurger).toEqual(mockNewOrder);
  });
  test('orderBurger.rejected', () => {
    const initialStateTest = {
      ...initialState,
      isOrderLoading: true,
      orderError: null
    };

    const errorMessage = 'error';
    const action = orderBurger.rejected(
      new Error('Rejected'),
      'test-rejected',
      mockOrderBurger,
      errorMessage
    );

    const newState = reducer(initialStateTest, action);

    expect(newState.isOrderLoading).toBe(false);
    expect(newState.orderError).toBe(errorMessage);
  });
});
