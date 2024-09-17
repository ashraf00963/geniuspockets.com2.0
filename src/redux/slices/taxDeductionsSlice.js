import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api'; // Adjust based on your API setup

const initialState = {
  deductions: [],
  loading: false,
  error: null,
};

// Async Thunk to add a new tax deduction
export const addTaxDeductionAsync = createAsyncThunk(
  'taxDeductions/addTaxDeduction',
  async (deductionData, { rejectWithValue }) => {
    try {
      const response = await api.post('/addTaxDeduction.php', deductionData);
      return response.data; // Expect success message and the new deduction
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add tax deduction');
    }
  }
);

// Async Thunk to edit an existing tax deduction
export const editTaxDeductionAsync = createAsyncThunk(
  'taxDeductions/editTaxDeduction',
  async (deductionData, { rejectWithValue }) => {
    try {
      const response = await api.post('/editTaxDeduction.php', deductionData);
      return response.data; // Expect success message
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to edit tax deduction');
    }
  }
);

// Async Thunk to fetch all tax deductions
export const fetchTaxDeductionsAsync = createAsyncThunk(
  'taxDeductions/fetchTaxDeductions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/getTaxDeductions.php');
      return response.data.deductions; // Expect an array of deductions
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch tax deductions');
    }
  }
);

const taxDeductionsSlice = createSlice({
  name: 'taxDeductions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add Tax Deduction
      .addCase(addTaxDeductionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTaxDeductionAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.deductions.push(action.payload); // Add new deduction to the list
      })
      .addCase(addTaxDeductionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit Tax Deduction
      .addCase(editTaxDeductionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editTaxDeductionAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.deductions.findIndex(
          (deduction) => deduction.id === action.payload.id
        );
        if (index !== -1) {
          state.deductions[index] = action.payload; // Update the edited deduction
        }
      })
      .addCase(editTaxDeductionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Tax Deductions
      .addCase(fetchTaxDeductionsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaxDeductionsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.deductions = action.payload; // Populate the deductions list
      })
      .addCase(fetchTaxDeductionsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default taxDeductionsSlice.reducer;
