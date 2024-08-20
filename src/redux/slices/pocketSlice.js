import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { fetchAvailableBalanceAsync } from './availableBalanceSlice';

const initialState = {
  pockets: [],
  transactions: [],
  loading: false,
  error: null,
};

// Fetch all pockets
export const fetchPocketsAsync = createAsyncThunk(
  'pockets/fetchPockets',
  async (_, { rejectWithValue }) => {
    try {
      const authToken = localStorage.getItem('auth_token');

      if (!authToken) {
        throw new Error('Authorization token not available');
      }

      const response = await api.get('/pockets.php', {
        headers: {
          Authorization: authToken,
        },
      });

      return response.data;  // This includes the 'status' field
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : { message: error.message });
    }
  }
);

// Update a pocket
export const updatePocketAsync = createAsyncThunk(
  'pockets/updatePocket',
  async (pocketData, { rejectWithValue }) => {
    try {
      const response = await api.post('/updatePocketInfo.php', pocketData);

      if (response.data.pocket) {
        return response.data.pocket;  // Return the updated pocket
      } else {
        return rejectWithValue({ message: 'Failed to retrieve updated pocket data.' });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update pocket';
      return rejectWithValue({ message: errorMessage });
    }
  }
);

// Async thunk for deleting a pocket
export const deletePocketAsync = createAsyncThunk(
  'pockets/deletePocket',
  async (pocketId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/deletePocket.php?id=${pocketId}`);
      if (response.data.success) {
        return pocketId;  // Return the ID of the deleted pocket
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete pocket');
    }
  }
);

// Deposit into a pocket
export const depositAsync = createAsyncThunk(
  'pockets/deposit',
  async ({ pocketId, amount }, { getState, dispatch, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await api.post('/deposit.php', {
        pocketId,
        amount,
        user_id: auth.user.id,
      });

      const { pocket, available_balance } = response.data;

      // Update the available balance in the state
      dispatch(fetchAvailableBalanceAsync());

      // Fetch latest transactions after deposit
      await dispatch(fetchPocketTransactionsAsync());

      // Return the updated pocket data
      return pocket;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to deposit' });
    }
  }
);


// Withdraw from a pocket
export const withdrawAsync = createAsyncThunk(
  'pockets/withdraw',
  async ({ pocketId, amount }, { getState, dispatch, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await api.post('/withdraw.php', {
        pocketId,
        amount,
        user_id: auth.user.id,
      });

      const { pocket, available_balance } = response.data;

      // Update the available balance in the state
      dispatch(fetchAvailableBalanceAsync());

      // Fetch latest transactions after deposit
      await dispatch(fetchPocketTransactionsAsync());

      // Return the updated pocket data
      return pocket;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to withdraw' });
    }
  }
);

// Add a new pocket
export const addPocketAsync = createAsyncThunk(
  'pockets/addPocket',
  async (pocketData, { rejectWithValue }) => {
    try {
      const response = await api.post('/addPocket.php', pocketData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add pocket';
      return rejectWithValue({ message: errorMessage });
    }
  }
);

// Async thunk for fetching pocket transactions
export const fetchPocketTransactionsAsync = createAsyncThunk(
  'pockets/fetchPocketTransactions',
  async (_, { rejectWithValue }) => { // No pocketId is passed
    try {
      const authToken = localStorage.getItem('auth_token');
      const response = await api.get('/getPocketTransactions.php', {
        headers: {
          Authorization: authToken,
        },
      }); // API endpoint fetches all transactions for the user
      return response.data.transactions;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch pocket transactions');
    }
  }
);

const pocketsSlice = createSlice({
  name: 'pockets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPocketsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPocketsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.pockets = action.payload;
      })
      .addCase(fetchPocketsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(depositAsync.fulfilled, (state, action) => {
        const updatedPocket = action.payload;
        state.pockets = state.pockets.map((pocket) =>
          pocket.id === updatedPocket.id ? updatedPocket : pocket
        );
      })
      .addCase(withdrawAsync.fulfilled, (state, action) => {
        const updatedPocket = action.payload;
        state.pockets = state.pockets.map((pocket) =>
          pocket.id === updatedPocket.id ? updatedPocket : pocket
        );
      })
      .addCase(addPocketAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPocketAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.pockets.push(action.payload);
      })
      .addCase(addPocketAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePocketAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePocketAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPocket = action.payload;
        state.pockets = state.pockets.map((pocket) =>
          pocket.id === updatedPocket.id ? updatedPocket : pocket
        );
      })
      .addCase(updatePocketAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePocketAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePocketAsync.fulfilled, (state, action) => {
        state.loading = false;
        const deletedPocketId = action.payload;
        state.pockets = state.pockets.filter((pocket) => pocket.id !== deletedPocketId);
      })
      .addCase(deletePocketAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPocketTransactionsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPocketTransactionsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchPocketTransactionsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default pocketsSlice.reducer;
