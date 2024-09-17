import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
  totalBalance: 0,
  loading: false,
  error: null,
};

// Async thunk for fetching total balance
export const fetchTotalBalanceAsync = createAsyncThunk(
    'totalBalance/fetchTotalBalance',
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) throw new Error('No token found');

        const response = await api.get('/totalBalance.php', {
          headers: {
            Authorization: token,
          },
        });

        if (response.data.success) {
          return response.data.total_balance;
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch total balance');
      }
    }
);

// Async thunk for updating total balance
export const updateTotalBalanceAsync = createAsyncThunk(
  'totalBalance/updateTotalBalance',
  async (newBalance, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No token found');

      const response = await api.post('/updateTotalBalance.php', { totalBalance: newBalance }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (response.data.success) {
        return newBalance; // Update the total balance in the state
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update total balance');
    }
  }
);

const totalBalanceSlice = createSlice({
  name: 'totalBalance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalBalanceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalBalanceAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.totalBalance = action.payload;
      })
      .addCase(fetchTotalBalanceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTotalBalanceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTotalBalanceAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.totalBalance = action.payload;
      })
      .addCase(updateTotalBalanceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default totalBalanceSlice.reducer;
