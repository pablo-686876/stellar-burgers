import { getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';
import {
  createSlice,
  createAsyncThunk,
  createSelector
} from '@reduxjs/toolkit';

type TOrderSlice = {
  order: TOrder;
  isOrderLoading: boolean;
  error: string | null;
};

const initialState: TOrderSlice = {
  order: {
    _id: '',
    status: '',
    name: '',
    createdAt: '',
    updatedAt: '',
    number: 0,
    ingredients: []
  },
  isOrderLoading: false,
  error: null
};

export const getOrder = createAsyncThunk(
  'order/get',
  async (number: number) => (await getOrderByNumberApi(number)).orders[0]
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  selectors: {
    isOrderLoadingSelector: (state) => state.isOrderLoading,
    errorSelector: (state) => state.error,
    orderSelector: (state) => state.order
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrder.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isOrderLoading = false;
      })
      .addCase(getOrder.pending, (state) => {
        state.isOrderLoading = true;
        state.error = null;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.order = action.payload;
      });
  }
});

export const { isOrderLoadingSelector, errorSelector, orderSelector } =
  orderSlice.selectors;

export const orderIdSelector = createSelector(
  [orderSelector],
  (order) => order._id
);

export const orderCreatedAtSelector = createSelector(
  [orderSelector],
  (order) => order.createdAt
);

export const orderUpdatedAtSelector = createSelector(
  [orderSelector],
  (order) => order.updatedAt
);

export const orderStatusSelector = createSelector(
  [orderSelector],
  (order) => order.status
);

export const orderNameSelector = createSelector(
  [orderSelector],
  (order) => order.name
);

export const orderNumberSelector = createSelector(
  [orderSelector],
  (order) => order.number
);

export const orderIngredientsSelector = createSelector(
  [orderSelector],
  (order) => order.ingredients
);

export default orderSlice.reducer;
