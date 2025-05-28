import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from './src/utils/axios';
import API_CONSTANTS from './src/utils/apiConstants';

// Define the Investor type based on the schema
interface Investor {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  location: string;
  availability: string;
  bio: string;
  sectors: string[];
  expertise: string[];
  specialization: string;
  experience: string;
  image: string;
}

// Define the state shape
interface InvestorState {
  investors: Investor[];
  selectedInvestor: Investor | null;
  loading: boolean;
  error: string | null;
  success: string | null;
}

// Initial state
const initialState: InvestorState = {
  investors: [],
  selectedInvestor: null,
  loading: false,
  error: null,
  success: null,
};

// Async thunk to fetch all investors
export const fetchInvestors = createAsyncThunk(
  'investor/fetchInvestors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_CONSTANTS.GET_ALL_INVESTORS);
      return response.data.investors || [];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || err.response?.data?.message || 'Failed to fetch investors'
      );
    }
  }
);

export const fetchInvestorById = createAsyncThunk(
  'investor/fetchInvestorById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_CONSTANTS.GET_INVESTOR_BY_ID(id));
      return response.data.investor;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || err.response?.data?.message || 'Failed to fetch investor details'
      );
    }
  }
);

// Async thunk to create a new investor
export const createInvestor = createAsyncThunk(
  'investor/createInvestor',
  async (
    investorData: {
      name: string;
      email: string;
      password: string;
      company: string;
      role: string;
      location: string;
      availability: string;
      bio: string;
      sectors: string[];
      expertise: string[];
      specialization: string;
      experience: string;
      image?: File | null;
    },
    { rejectWithValue }
  ) => {
    try {
      const formDataToSend = new FormData();
      
      // Append all fields to FormData
      formDataToSend.append('name', investorData.name);
      formDataToSend.append('email', investorData.email);
      formDataToSend.append('password', investorData.password);
      formDataToSend.append('company', investorData.company);
      formDataToSend.append('role', investorData.role);
      formDataToSend.append('location', investorData.location);
      formDataToSend.append('availability', investorData.availability);
      formDataToSend.append('bio', investorData.bio);
      formDataToSend.append('sectors', JSON.stringify(investorData.sectors));
      formDataToSend.append('expertise', JSON.stringify(investorData.expertise));
      formDataToSend.append('specialization', investorData.specialization);
      formDataToSend.append('experience', investorData.experience);
      
      if (investorData.image) {
        formDataToSend.append('image', investorData.image);
      }

      const response = await axiosInstance.post(
        API_CONSTANTS.CREATE_INVESTOR,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data.investor;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || err.response?.data?.message || 'Failed to create investor'
      );
    }
  }
);

// Async thunk to update an investor
export const updateInvestor = createAsyncThunk(
  'investor/updateInvestor',
  async (
    {
      id,
      updatedData,
    }: {
      id: string;
      updatedData: {
        name?: string;
        email?: string;
        company?: string;
        role?: string;
        location?: string;
        availability?: string;
        bio?: string;
        sectors?: string[];
        expertise?: string[];
        specialization?: string;
        experience?: string;
        image?: File | null;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const formDataToSend = new FormData();
      
      // Append only provided fields to FormData
      Object.keys(updatedData).forEach((key) => {
        const value = updatedData[key as keyof typeof updatedData];
        if (value !== undefined && value !== null) {
          if (key === 'sectors' || key === 'expertise') {
            formDataToSend.append(key, JSON.stringify(value));
          } else if (key === 'image' && value instanceof File) {
            formDataToSend.append(key, value);
          } else if (key !== 'image') {
            formDataToSend.append(key, value as string);
          }
        }
      });

      const response = await axiosInstance.put(
        API_CONSTANTS.EDIT_INVESTOR(id),
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data.investor;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || err.response?.data?.message || 'Failed to update investor'
      );
    }
  }
);

// Async thunk to delete an investor
export const deleteInvestor = createAsyncThunk(
  'investor/deleteInvestor',
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(API_CONSTANTS.DELETE_INVESTOR(id));
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || err.response?.data?.message || 'Failed to delete investor'
      );
    }
  }
);

// Async thunk to search investors
export const searchInvestors = createAsyncThunk(
  'investor/searchInvestors',
  async (
    searchParams: {
      query?: string;
      sectors?: string[];
      expertise?: string[];
      location?: string;
      availability?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      
      if (searchParams.query) {
        params.append('query', searchParams.query);
      }
      if (searchParams.sectors && searchParams.sectors.length > 0) {
        params.append('sectors', searchParams.sectors.join(','));
      }
      if (searchParams.expertise && searchParams.expertise.length > 0) {
        params.append('expertise', searchParams.expertise.join(','));
      }
      if (searchParams.location) {
        params.append('location', searchParams.location);
      }
      if (searchParams.availability) {
        params.append('availability', searchParams.availability);
      }

      const response = await axiosInstance.get(
        `${API_CONSTANTS.GET_ALL_INVESTORS}?${params.toString()}`
      );
      
      return response.data.investors || [];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || err.response?.data?.message || 'Failed to search investors'
      );
    }
  }
);

// Create the investor slice
const investorSlice = createSlice({
  name: 'investor',
  initialState,
  reducers: {
    // Clear error and success messages
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
    
    // Clear selected investor
    clearSelectedInvestor: (state) => {
      state.selectedInvestor = null;
    },
    
    // Set selected investor
    setSelectedInvestor: (state, action) => {
      state.selectedInvestor = action.payload;
    },
    
    // Reset state
    resetInvestorState: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all investors
      .addCase(fetchInvestors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvestors.fulfilled, (state, action) => {
        state.loading = false;
        state.investors = action.payload;
        state.error = null;
      })
      .addCase(fetchInvestors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch investor by ID
      .addCase(fetchInvestorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvestorById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedInvestor = action.payload;
        state.error = null;
      })
      .addCase(fetchInvestorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create investor
      .addCase(createInvestor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createInvestor.fulfilled, (state, action) => {
        state.loading = false;
        state.investors.push(action.payload);
        state.success = 'Investor created successfully';
        state.error = null;
      })
      .addCase(createInvestor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = null;
      })
      
      // Update investor
      .addCase(updateInvestor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateInvestor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.investors.findIndex(
          (investor) => investor.id === action.payload.id
        );
        if (index !== -1) {
          state.investors[index] = action.payload;
        }
        if (state.selectedInvestor && state.selectedInvestor.id === action.payload.id) {
          state.selectedInvestor = action.payload;
        }
        state.success = 'Investor updated successfully';
        state.error = null;
      })
      .addCase(updateInvestor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = null;
      })
      
      // Delete investor
      .addCase(deleteInvestor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteInvestor.fulfilled, (state, action) => {
        state.loading = false;
        state.investors = state.investors.filter(
          (investor) => investor.id !== action.payload
        );
        if (state.selectedInvestor && state.selectedInvestor.id === action.payload) {
          state.selectedInvestor = null;
        }
        state.success = 'Investor deleted successfully';
        state.error = null;
      })
      .addCase(deleteInvestor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = null;
      })
      
      // Search investors
      .addCase(searchInvestors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchInvestors.fulfilled, (state, action) => {
        state.loading = false;
        state.investors = action.payload;
        state.error = null;
      })
      .addCase(searchInvestors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  clearMessages,
  clearSelectedInvestor,
  setSelectedInvestor,
  resetInvestorState,
} = investorSlice.actions;

// Export selectors
export const selectInvestors = (state: { investor: InvestorState }) => state.investor.investors;
export const selectSelectedInvestor = (state: { investor: InvestorState }) => state.investor.selectedInvestor;
export const selectInvestorLoading = (state: { investor: InvestorState }) => state.investor.loading;
export const selectInvestorError = (state: { investor: InvestorState }) => state.investor.error;
export const selectInvestorSuccess = (state: { investor: InvestorState }) => state.investor.success;

// Export reducer
export default investorSlice.reducer;