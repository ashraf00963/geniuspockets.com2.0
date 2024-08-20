import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchAvailableBalanceAsync = createAsyncThunk(
  'availableBalance/fetchAvailableBalance',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No token found');

      const response = await api.get('/updateAvailableBalance.php', {
        headers: {
          Authorization: token,
        },
      });

      if (response.data.success) {
        return response.data.available_balance;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch available balance');
    }
  }
);

const availableBalanceSlice = createSlice({
  name: 'availableBalance',
  initialState: {
    balance: 0,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableBalanceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableBalanceAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload;
      })
      .addCase(fetchAvailableBalanceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default availableBalanceSlice.reducer;
