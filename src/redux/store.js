import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import incomeReducer from './slices/incomeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    income: incomeReducer,
  },
});
