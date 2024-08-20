// src/redux/slices/expenseSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
  expenses: [],
  loading: false,
  error: null,
};

// Async thunk for adding expense
export const addExpenseAsync = createAsyncThunk(
  'expense/addExpense',
  async (expenseData, { rejectWithValue }) => {
    try {
      const response = await api.post('/addExpense.php', expenseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to add expense');
    }
  }
);

// Async thunk for fetching expenses
export const fetchExpensesAsync = createAsyncThunk(
  'expense/fetchExpenses',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No token found');

      const response = await api.get('/getExpenses.php', {
        headers: {
          Authorization: token,
        },
      });

      if (response.data.success) {
        return response.data.expenses;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch expenses');
    }
  }
);

// Async thunk for updating expense
export const updateExpenseAsync = createAsyncThunk(
  'expense/updateExpense',
  async (expenseData, { rejectWithValue }) => {
    try {
      const response = await api.put('/updateExpense.php', expenseData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      if (response.data.success) {
        return response.data; // Ensure this returns the updated data structure
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update expense');
    }
  }
);

// Async thunk for deleting expense
export const deleteExpenseAsync = createAsyncThunk(
  'expense/deleteExpense',
  async (expenseId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/deleteExpense.php?id=${expenseId}`);
      if (response.data.success) {
        return { id: expenseId };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete expense');
    }
  }
);

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addExpenseAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExpenseAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses.push(action.payload); // Add the new expense to the state
      })
      .addCase(addExpenseAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchExpensesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpensesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload; // Set the fetched expenses
      })
      .addCase(fetchExpensesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateExpenseAsync.fulfilled, (state, action) => {
        const updatedExpense = action.payload.expense;
        const index = state.expenses.findIndex((expense) => expense.id === updatedExpense.id);
        if (index !== -1) {
          state.expenses[index] = updatedExpense;
        }
      })
      .addCase(updateExpenseAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteExpenseAsync.fulfilled, (state, action) => {
        const deletedExpenseId = action.payload.id;
        state.expenses = state.expenses.filter((expense) => expense.id !== deletedExpenseId);
      })
      .addCase(deleteExpenseAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default expenseSlice.reducer;
