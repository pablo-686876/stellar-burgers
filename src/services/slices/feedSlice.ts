import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';
import { getFeedsApi } from '@api';
import { createSelector } from 'reselect';

type TFeedSlice = {
  orders: TOrdersData;
  isFeedsLoading: boolean;
  error: string | null;
};

const initialState: TFeedSlice = {
  orders: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  isFeedsLoading: false,
  error: null
};

export const getFeeds = createAsyncThunk(
  'feeds/get',
  async () => await getFeedsApi()
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    isFeedsLoadingSelector: (state) => state.isFeedsLoading,
    errorSelector: (state) => state.error,
    fullOrdersSelector: (state) => state.orders
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isFeedsLoading = false;
      })
      .addCase(getFeeds.pending, (state) => {
        state.isFeedsLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isFeedsLoading = false;
        state.orders = action.payload;
      });
  }
});

export const { isFeedsLoadingSelector, errorSelector, fullOrdersSelector } =
  feedSlice.selectors;

export const ordersSelector = createSelector(
  [fullOrdersSelector],
  (orders) => orders.orders
);

export const feedSelector = createSelector([fullOrdersSelector], (orders) => ({
  total: orders.total,
  totalToday: orders.totalToday
}));

export default feedSlice.reducer;
