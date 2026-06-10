import {
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  registerUserApi,
  getOrdersApi
} from '@api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { TUser } from '@utils-types';
import { TRegisterData, TLoginData } from '@api';
import { setCookie, deleteCookie } from '../../utils/cookie';
import { TOrder } from '@utils-types';

type TUserSlice = {
  user: TUser | null;
  isAuthLoading: boolean;
  error: string | null;
  orders: TOrder[];
  isOrdersLoading: boolean;
};

const initialState: TUserSlice = {
  user: null,
  isAuthLoading: false,
  error: null,
  orders: [],
  isOrdersLoading: false
};

export const getOrders = createAsyncThunk(
  'user/orders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrdersApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getUser = createAsyncThunk(
  'user/get-user',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(data);
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    isAuthLoadingSelector: (state) => state.isAuthLoading,
    isOrdersLoadingSelector: (state) => state.isOrdersLoading,
    errorSelector: (state) => state.error,
    userSelector: (state) => state.user,
    ordersSelector: (state) => state.orders
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isAuthLoading = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.isAuthLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthLoading = false;
      }) //register
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isAuthLoading = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isAuthLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthLoading = false;
      }) //login
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isAuthLoading = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isAuthLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthLoading = false;
      }) //logout
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isAuthLoading = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.isAuthLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthLoading = false;
      }) //update
      .addCase(getUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isAuthLoading = false;
      })
      .addCase(getUser.pending, (state) => {
        state.isAuthLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthLoading = false;
      }) //get-user
      .addCase(getOrders.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isOrdersLoading = false;
      })
      .addCase(getOrders.pending, (state) => {
        state.isOrdersLoading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isOrdersLoading = false;
      }); // get-orders
  }
});

export const {
  isAuthLoadingSelector,
  isOrdersLoadingSelector,
  errorSelector,
  userSelector,
  ordersSelector
} = userSlice.selectors;

export const userNameSelector = createSelector(
  [userSelector],
  (user) => user!.name
);

export const userEmailSelector = createSelector(
  [userSelector],
  (user) => user!.email
);

export default userSlice.reducer;
