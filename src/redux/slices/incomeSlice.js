// src/redux/slices/incomeSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
  incomes: [],
  loading: false,
  error: null,
  userSalary: null,
};

// Async thunk for adding income
export const addIncomeAsync = createAsyncThunk(
  'income/addIncome',
  async (incomeData, { rejectWithValue }) => {
    try {
      const response = await api.post('/addIncome.php', incomeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to add income');
    }
  }
);

// Async thunk for fetching incomes
export const fetchIncomesAsync = createAsyncThunk(
  'income/fetchIncomes',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No token found');

      const response = await api.get('/getIncomes.php', {
        headers: {
          Authorization: token,
        },
      });

      if (response.data.success) {
        return response.data.incomes;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch incomes');
    }
  }
);

// Async thunk for updating income
export const updateIncomeAsync = createAsyncThunk(
  'income/updateIncome',
  async (incomeData, { rejectWithValue }) => {
    try {
      const response = await api.put('/updateIncome.php', incomeData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`, // Include token if necessary
        },
      });
      if (response.data.success) {
        return response.data; // Ensure this returns the updated data structure
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update income');
    }
  }
);

// Async thunk for deleting income
export const deleteIncomeAsync = createAsyncThunk(
  'income/deleteIncome',
  async (incomeId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/deleteIncome.php?id=${incomeId}`);
      if (response.data.success) {
        return { id: incomeId };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete income');
    }
  }
);

// Fetch user salary
export const fetchUserSalaryAsync = createAsyncThunk(
  'income/fetchUserSalary',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No token found');

      const response = await api.get('/fetchUserSalary.php', {
        headers: {
          Authorization: token,
        },
      });

      if (response.data.success) {
        return response.data; // Includes monthlySalary, hpw, and possibly dom
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user salary');
    }
  }
);

const incomeSlice = createSlice({
  name: 'income',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addIncomeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addIncomeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.incomes.push(action.payload); // Add the new income to the state
      })
      .addCase(addIncomeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchIncomesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncomesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.incomes = action.payload; // Set the fetched incomes
      })
      .addCase(fetchIncomesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateIncomeAsync.fulfilled, (state, action) => {
        const updatedIncome = action.payload.income;
        const index = state.incomes.findIndex((income) => income.id === updatedIncome.id);
        if (index !== -1) {
          state.incomes[index] = updatedIncome;
        }
      })
      .addCase(updateIncomeAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteIncomeAsync.fulfilled, (state, action) => {
        const deletedIncomeId = action.payload.id;
        state.incomes = state.incomes.filter((income) => income.id !== deletedIncomeId);
      })
      .addCase(deleteIncomeAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchUserSalaryAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSalaryAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.userSalary = action.payload; // Set the user salary details
      })
      .addCase(fetchUserSalaryAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default incomeSlice.reducer;
