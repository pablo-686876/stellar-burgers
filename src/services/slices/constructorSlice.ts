import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { orderBurgerApi } from '@api';
import { TConstructorIngredient } from '@utils-types';
import { nanoid } from '@reduxjs/toolkit';
import { TNewOrder } from '@api';

type TConstructorSlice = {
  orderIngredients: TConstructorIngredient[];
  bun: TConstructorIngredient | null;
  isOrderLoading: boolean;
  orderBurger: TNewOrder | null;
  orderError: string | null;
};

const initialState: TConstructorSlice = {
  orderIngredients: [],
  bun: null,
  isOrderLoading: false,
  orderBurger: null,
  orderError: null
};

export const orderBurger = createAsyncThunk(
  'user/order-burger',
  async (data: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(data);
      return response.order;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const constructorSlice = createSlice({
  name: 'constructorSlice',
  initialState,
  reducers: {
    clearState: (state) => {
      state.orderBurger = null;
      state.orderError = null;
    },
    addOrderIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.orderIngredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: nanoid()
        }
      })
    },

    addOrderBun: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.bun = action.payload;
      },
      prepare: (bun: TIngredient) => ({
        payload: {
          ...bun,
          id: nanoid()
        }
      })
    },
    deleteOrderIngredient: (state, action: PayloadAction<string>) => {
      state.orderIngredients = state.orderIngredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveOrderIngredientDown: (state, action: PayloadAction<string>) => {
      const index = state.orderIngredients.findIndex(
        (ingredient) => ingredient.id === action.payload
      );
      if (index === state.orderIngredients.length) return;
      [state.orderIngredients[index], state.orderIngredients[index + 1]] = [
        state.orderIngredients[index + 1],
        state.orderIngredients[index]
      ];
    },
    moveOrderIngredientUp: (state, action: PayloadAction<string>) => {
      const index = state.orderIngredients.findIndex(
        (ingredient) => ingredient.id === action.payload
      );
      if (index === 0) return;
      [state.orderIngredients[index], state.orderIngredients[index - 1]] = [
        state.orderIngredients[index - 1],
        state.orderIngredients[index]
      ];
    }
  },
  selectors: {
    orderIngredientSelector: (state) => state.orderIngredients,
    orderBunSelector: (state) => state.bun,
    orderBurgerSelector: (state) => state.orderBurger,
    orderErrorSelector: (state) => state.orderError,
    isOrderLoadingSelector: (state) => state.isOrderLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.orderError = action.payload as string;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.orderBurger = action.payload;
        state.bun = null;
        state.orderIngredients = [];
      })
      .addCase(orderBurger.pending, (state) => {
        state.isOrderLoading = true;
        state.orderError = null;
      });
  }
});

export const {
  orderIngredientSelector,
  orderBunSelector,
  orderBurgerSelector,
  orderErrorSelector,
  isOrderLoadingSelector
} = constructorSlice.selectors;

export const {
  addOrderIngredient,
  addOrderBun,
  deleteOrderIngredient,
  moveOrderIngredientUp,
  moveOrderIngredientDown,
  clearState
} = constructorSlice.actions;

export default constructorSlice.reducer;
