import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import incomeReducer from './slices/incomeSlice';
import expenseSlice from './slices/expenseSlice';
import totalBalanceSlice from './slices/totalBalanceSlice';
import availableBalanceSlice from './slices/availableBalanceSlice';
import pocketSlice from './slices/pocketSlice';
import taxDeductionsReducer from './slices/taxDeductionsSlice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    income: incomeReducer,
    expense: expenseSlice,
    totalBalance: totalBalanceSlice,
    availableBalance: availableBalanceSlice,
    pockets: pocketSlice,
    taxDeductions: taxDeductionsReducer,
  },
});
