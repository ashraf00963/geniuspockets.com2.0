// src/redux/slices/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
  user: null, // Stores user object, which includes the user_id
  loading: false,
  error: null,
  message: null,
};

// Async thunk for registering a new user
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/register.php', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for logging in a user
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/login.php', userData);
      if (response.data.success) {
        localStorage.setItem('auth_token', response.data.auth_token); // Store token on success
        return response.data; // Return data if success
      } else {
        return rejectWithValue(response.data.message); // Reject with message on failure
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An unexpected error occurred');
    }
  }
);

// Async thunk for validating the session using the auth token
export const validateSession = createAsyncThunk(
  'auth/validateSession',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No token found');

      const response = await api.get('/validateSession.php', {
        headers: {
          'Authorization': token,
        },
      });

      if (response.data.success) {
        return response.data; // Return response data on success
      } else {
        throw new Error(response.data.message); // Handle failure
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Session validation failed');
    }
  }
);

// Async thunk for resetting the user's password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/resetPassword.php', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { id: action.payload.user_id };
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
        state.message = null;
        state.user = null; 
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = null;
      })
      .addCase(validateSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(validateSession.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { id: action.payload.user_id }; // Store the user ID
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(validateSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.message = null;
        state.user = null;
        localStorage.removeItem('auth_token'); // Remove token on validation failure
      });
  },
});

export const { clearMessages } = authSlice.actions;

export default authSlice.reducer;
