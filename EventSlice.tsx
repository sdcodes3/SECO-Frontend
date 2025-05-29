import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from './src/utils/axios';
import API_CONSTANTS from './src/utils/apiConstants';

// Define the Event type based on the Supabase schema
interface Event {
  id: string;
  title: string | null;
  description: string | null;
  start_date: string | null;
  start_time: string | null;
  end_date: string | null;
  end_time: string | null;
  type: string | null;
  capacity: number | null;
  location_link: string | null;
  form_id: string | null;
  created_at: string;
  updated_at: string | null;
  created_by: string | null;
  stages: any | null; // JSON type in Supabase
  is_virtual: boolean | null;
  judges_emails: string | null;
  website: string | null;
  banner: string | null;
}

// Define the state shape
interface EventState {
  events: Event[];
  filteredEvents: Event[];
  selectedEvent: Event | null;
  loading: boolean;
  error: string | null;
  success: string | null;
  uniqueLocations: string[];
  eventTypes: string[];
  searchQuery: string;
  selectedType: string;
  selectedLocation: string;
}

// Initial state
const initialState: EventState = {
  events: [],
  filteredEvents: [],
  selectedEvent: null,
  loading: false,
  error: null,
  success: null,
  uniqueLocations: ['All Locations'],
  eventTypes: ['All Types'],
  searchQuery: '',
  selectedType: 'All Types',
  selectedLocation: 'All Locations',
};

// Async thunk to fetch all events
export const fetchEvents = createAsyncThunk(
  'event/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_CONSTANTS.GET_ALL_EVENTS);
      return response.data.events || [];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || err.response?.data?.message || 'Failed to fetch events'
      );
    }
  }
);

// Async thunk to fetch an event by ID
export const fetchEventById = createAsyncThunk(
  'event/fetchEventById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_CONSTANTS.GET_EVENT_BY_ID(id));
      return response.data.event;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || err.response?.data?.message || 'Failed to fetch event details'
      );
    }
  }
);

// Create the event slice
const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    // Set filters and apply filtering logic
    setFilters: (
      state,
      action: {
        payload: {
          searchQuery?: string;
          selectedType?: string;
          selectedLocation?: string;
        };
      }
    ) => {
      const { searchQuery, selectedType, selectedLocation } = action.payload;

      // Update filter values if provided
      if (searchQuery !== undefined) {
        state.searchQuery = searchQuery;
      }
      if (selectedType !== undefined) {
        state.selectedType = selectedType;
      }
      if (selectedLocation !== undefined) {
        state.selectedLocation = selectedLocation;
      }

      // Apply filtering logic
      let filtered = [...state.events];

      // Apply search query filter
      if (state.searchQuery) {
        filtered = filtered.filter(
          (event) =>
            (event.title?.toLowerCase() || '').includes(state.searchQuery.toLowerCase()) ||
            (event.description?.toLowerCase() || '').includes(state.searchQuery.toLowerCase())
        );
      }

      // Apply type filter
      if (state.selectedType !== 'All Types') {
        filtered = filtered.filter(
          (event) => (event.type?.toLowerCase() || '') === state.selectedType.toLowerCase()
        );
      }

      // Apply location filter
      if (state.selectedLocation !== 'All Locations') {
        filtered = filtered.filter(
          (event) => (event.location_link || '') === state.selectedLocation
        );
      }

      state.filteredEvents = filtered;
    },

    // Clear error and success messages
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },

    // Clear selected event
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
    },

    // Reset state
    resetEventState: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
        state.filteredEvents = action.payload;
        state.error = null;
        // Extract unique locations
        const locations = [
          'All Locations',
          ...Array.from(
            new Set(
              action.payload
                .map((event: Event) => event.location_link)
                .filter(Boolean)
            )
          ),
        ];
        state.uniqueLocations = locations as string[];
        // Extract unique event types
        const types = [
          'All Types',
          ...Array.from(
            new Set(
              action.payload
                .map((event: Event) => event.type)
                .filter(Boolean)
                .map((type: string) => type.toLowerCase())
            )
          ),
        ];
        state.eventTypes = types as string[];
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch event by ID
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEvent = action.payload;
        state.error = null;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  setFilters,
  clearMessages,
  clearSelectedEvent,
  resetEventState,
} = eventSlice.actions;

// Export reducer
export default eventSlice.reducer;