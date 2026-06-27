import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';
import { createSelector } from 'reselect';

type TGetIngredients = {
  isIngredientsLoading: boolean;
  ingridients: TIngredient[];
  error: string | null;
  isInit: boolean;
};

export const initialState: TGetIngredients = {
  isIngredientsLoading: false,
  ingridients: [],
  error: null,
  isInit: false
};

export const getIngredients = createAsyncThunk(
  'ingredients/get',
  async (_, { rejectWithValue }) => {
    try {
      return await getIngredientsApi();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getIngredientsSlice = createSlice({
  name: 'getIngredients',
  initialState,
  reducers: {},
  selectors: {
    isIngredientsLoadingSelector: (state) => state.isIngredientsLoading,
    errorSelector: (state) => state.error,
    ingredientsSelector: (state) => state.ingridients,
    isInitSelector: (state) => state.isInit
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isInit = true;
        state.isIngredientsLoading = false;
      })
      .addCase(getIngredients.pending, (state) => {
        state.isIngredientsLoading = true;
        state.error = null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isIngredientsLoading = false;
        state.ingridients = action.payload;
        state.isInit = true;
      });
  }
});

export const {
  isIngredientsLoadingSelector,
  errorSelector,
  ingredientsSelector,
  isInitSelector
} = getIngredientsSlice.selectors;

export const ingredientsBunSelector = createSelector(
  [ingredientsSelector],
  (ingredients) => ingredients.filter((item) => item.type === 'bun')
);

export const ingredientsMainSelector = createSelector(
  [ingredientsSelector],
  (ingredients) => ingredients.filter((item) => item.type === 'main')
);

export const ingredientsSauceSelector = createSelector(
  [ingredientsSelector],
  (ingredients) => ingredients.filter((item) => item.type === 'sauce')
);

export const getIngredientSelector = createSelector(
  [ingredientsSelector],
  (ingredients) => ingredients.filter((item) => item.type === 'sauce')
);

export default getIngredientsSlice.reducer;
