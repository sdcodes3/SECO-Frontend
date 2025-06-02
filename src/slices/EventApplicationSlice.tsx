import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axios';
import API_CONSTANTS from '../utils/apiConstants';

// Define the Event Application type based on the schema
interface IEventApplication {
  id?: string;
  user_id: string;
  event_id: string;
  applied_date?: string;
  status: string;
  documents?: string[];
  project_description?: string;
}

// Define the state shape
interface EventApplicationState {
  eventApplications: IEventApplication[];
  selectedEventApplication: IEventApplication | null;
  loading: boolean;
  error: string | null;
  success: string | null;
  previousEventApplications: IEventApplication[];
  previousSelectedEventApplication: IEventApplication | null;
}

// Initial state
const initialState: EventApplicationState = {
  eventApplications: [],
  selectedEventApplication: null,
  loading: false,
  error: null,
  success: null,
  previousEventApplications: [],
  previousSelectedEventApplication: null,
};

export const fetchEventApplications = createAsyncThunk(
  'eventApplication/fetchEventApplications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_CONSTANTS.GET_ALL_EVENT_APPLICATIONS);
      return response.data.applications || [];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || err.response?.data?.message || 'Failed to fetch event applications'
      );
    }
  }
);

export const fetchEventApplicationsByUser = createAsyncThunk(
  'eventApplication/fetchEventApplicationsByUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_CONSTANTS.GET_EVENT_APPLICATIONS_BY_USER);
      return response.data.applications || [];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || err.response?.data?.message || 'Failed to fetch event applications by user'
      );
    }
  }
);

export const fetchEventApplicationsByEvent = createAsyncThunk(
  'eventApplication/fetchEventApplicationsByEvent',
  async (eventId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_CONSTANTS.GET_EVENT_APPLICATIONS_BY_EVENT(eventId));
      return response.data.applications || [];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || err.response?.data?.message || 'Failed to fetch event applications by event'
      );
    }
  }
);

export const fetchEventApplicationById = createAsyncThunk(
  'eventApplication/fetchEventApplicationById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_CONSTANTS.GET_EVENT_APPLICATION_BY_ID(id));
      return response.data.application;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || err.response?.data?.message || 'Failed to fetch event application details'
      );
    }
  }
);

export const createEventApplication = createAsyncThunk(
  'eventApplication/createEventApplication',
  async (
    applicationData: {
      user_id: string;
      event_id: string;
      status: string;
      documents?: string[];
      project_description?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(API_CONSTANTS.CREATE_EVENT_APPLICATION, applicationData);
      return response.data.application;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || err.response?.data?.message || 'Failed to create event application'
      );
    }
  }
);

export const updateEventApplication = createAsyncThunk(
  'eventApplication/updateEventApplication',
  async (
    {
      id,
      updatedData,
    }: {
      id: string;
      updatedData: {
        status?: string;
        documents?: string[];
        project_description?: string;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(API_CONSTANTS.EDIT_EVENT_APPLICATION(id), updatedData);
      return response.data.application;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || err.response?.data?.message || 'Failed to update event application'
      );
    }
  }
);

export const deleteEventApplication = createAsyncThunk(
  'eventApplication/deleteEventApplication',
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(API_CONSTANTS.DELETE_EVENT_APPLICATION(id));
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || err.response?.data?.message || 'Failed to delete event application'
      );
    }
  }
);

// Create the event application slice
const eventApplicationSlice = createSlice({
  name: 'eventApplication',
  initialState,
  reducers: {

    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },

  
    clearSelectedEventApplication: (state) => {
      state.selectedEventApplication = null;
    },

    setSelectedEventApplication: (state, action) => {
      state.selectedEventApplication = action.payload;
    },

    resetEventApplicationState: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.eventApplications = action.payload;
        state.error = null;
      })
      .addCase(fetchEventApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchEventApplicationsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventApplicationsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.eventApplications = action.payload;
        state.error = null;
      })
      .addCase(fetchEventApplicationsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchEventApplicationsByEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventApplicationsByEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.eventApplications = action.payload;
        state.error = null;
      })
      .addCase(fetchEventApplicationsByEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch event application by ID
      .addCase(fetchEventApplicationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventApplicationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEventApplication = action.payload;
        state.error = null;
      })
      .addCase(fetchEventApplicationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create event application with optimistic update
      .addCase(createEventApplication.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        // Optimistic update: Add a temporary event application to the list
        const tempApplication: IEventApplication = {
          id: `temp-${Date.now()}`, // Temporary ID
          user_id: action.meta.arg.user_id,
          event_id: action.meta.arg.event_id,
          applied_date: new Date().toISOString(),
          status: action.meta.arg.status,
          documents: action.meta.arg.documents || [],
          project_description: action.meta.arg.project_description || '',
        };
        state.eventApplications.push(tempApplication);
      })
      .addCase(createEventApplication.fulfilled, (state, action) => {
        state.loading = false;
        // Replace the temporary application with the actual one from the API
        const tempIndex = state.eventApplications.findIndex((app) => app.id?.startsWith('temp-'));
        if (tempIndex !== -1) {
          state.eventApplications[tempIndex] = action.payload;
        }
        state.success = 'Event application created successfully';
        state.error = null;
      })
      .addCase(createEventApplication.rejected, (state, action) => {
        state.loading = false;
        // Remove the temporary application on failure
        state.eventApplications = state.eventApplications.filter((app) => !app.id?.startsWith('temp-'));
        state.error = action.payload as string;
        state.success = null;
      })

      // Update event application with optimistic update
      .addCase(updateEventApplication.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        // Store the previous state for reverting
        state.previousEventApplications = [...state.eventApplications];
        state.previousSelectedEventApplication = state.selectedEventApplication
          ? { ...state.selectedEventApplication }
          : null;
        // Optimistic update: Update the application in the list
        const index = state.eventApplications.findIndex(
          (app) => app.id === action.meta.arg.id
        );
        if (index !== -1) {
          state.eventApplications[index] = {
            ...state.eventApplications[index],
            ...action.meta.arg.updatedData,
            documents: action.meta.arg.updatedData.documents || state.eventApplications[index].documents,
            project_description: action.meta.arg.updatedData.project_description || state.eventApplications[index].project_description,
          };
        }
        if (state.selectedEventApplication && state.selectedEventApplication.id === action.meta.arg.id) {
          state.selectedEventApplication = {
            ...state.selectedEventApplication,
            ...action.meta.arg.updatedData,
            documents: action.meta.arg.updatedData.documents || state.selectedEventApplication.documents,
            project_description: action.meta.arg.updatedData.project_description || state.selectedEventApplication.project_description,
          };
        }
      })
      .addCase(updateEventApplication.fulfilled, (state, action) => {
        state.loading = false;
        // Confirm the update with the actual API response
        const index = state.eventApplications.findIndex(
          (app) => app.id === action.payload.id
        );
        if (index !== -1) {
          state.eventApplications[index] = action.payload;
        }
        if (state.selectedEventApplication && state.selectedEventApplication.id === action.payload.id) {
          state.selectedEventApplication = action.payload;
        }
        state.success = 'Event application updated successfully';
        state.error = null;
        // Clear previous state
        state.previousEventApplications = [];
        state.previousSelectedEventApplication = null;
      })
      .addCase(updateEventApplication.rejected, (state, action) => {
        state.loading = false;
        // Revert the optimistic update on failure
        state.eventApplications = [...state.previousEventApplications];
        state.selectedEventApplication = state.previousSelectedEventApplication
          ? { ...state.previousSelectedEventApplication }
          : null;
        state.error = action.payload as string;
        state.success = null;
        // Clear previous state
        state.previousEventApplications = [];
        state.previousSelectedEventApplication = null;
      })

      // Delete event application with optimistic update
      .addCase(deleteEventApplication.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        // Store the previous state for reverting
        state.previousEventApplications = [...state.eventApplications];
        state.previousSelectedEventApplication = state.selectedEventApplication
          ? { ...state.selectedEventApplication }
          : null;
        // Optimistic update: Remove the application from the list
        state.eventApplications = state.eventApplications.filter(
          (app) => app.id !== action.meta.arg
        );
        if (state.selectedEventApplication && state.selectedEventApplication.id === action.meta.arg) {
          state.selectedEventApplication = null;
        }
      })
      .addCase(deleteEventApplication.fulfilled, (state) => {
        state.loading = false;
        state.success = 'Event application deleted successfully';
        state.error = null;
        state.previousEventApplications = [];
        state.previousSelectedEventApplication = null;
      })
      .addCase(deleteEventApplication.rejected, (state, action) => {
        state.loading = false;
        // Revert the optimistic update on failure
        state.eventApplications = [...state.previousEventApplications];
        state.selectedEventApplication = state.previousSelectedEventApplication
          ? { ...state.previousSelectedEventApplication }
          : null;
        state.error = action.payload as string;
        state.success = null;
        state.previousEventApplications = [];
        state.previousSelectedEventApplication = null;
      });
  },
});


export const {
  clearMessages,
  clearSelectedEventApplication,
  setSelectedEventApplication,
  resetEventApplicationState,
} = eventApplicationSlice.actions;


export const selectEventApplications = (state: { eventApplication: EventApplicationState }) =>
  state.eventApplication.eventApplications;
export const selectSelectedEventApplication = (state: { eventApplication: EventApplicationState }) =>
  state.eventApplication.selectedEventApplication;
export const selectEventApplicationLoading = (state: { eventApplication: EventApplicationState }) =>
  state.eventApplication.loading;
export const selectEventApplicationError = (state: { eventApplication: EventApplicationState }) =>
  state.eventApplication.error;
export const selectEventApplicationSuccess = (state: { eventApplication: EventApplicationState }) =>
  state.eventApplication.success;


export default eventApplicationSlice.reducer;