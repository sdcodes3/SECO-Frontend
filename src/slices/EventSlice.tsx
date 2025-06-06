import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axios';
import API_CONSTANTS from '../utils/apiConstants';

// Define the Stage type
interface Stage {
  id: string;
  name: string;
  description: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
}

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
  stages: string | Stage[] | null;
  is_virtual: boolean | null;
  judges_emails: string | null;
  website: string | null;
  banner: string | null;
}

// Define the Form Field type
interface FormField {
  id: number;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  description?: string;
}

// Define the state shape for event creation
interface EventCreationState {
  formData: {
    title: string;
    description: string;
    start_date: string;
    start_time: string;
    end_date: string;
    end_time: string;
    location_link: string;
    type: string;
    created_by: string;
    capacity: number | string;
    website: string;
    judges_emails: string;
    is_virtual: boolean;
    stages: Stage[];
    errors?: Record<string, string>;
  };
  stages: Stage[];
  fields: FormField[];
  eventId: string | null;
  bannerPreview: string | null;
  step: number;
  showQuestionModal: boolean;
  questionStep: number;
  newQuestion: FormField;
  activeTab: 'edit' | 'preview';
  previewFormData: Record<string, any>;
  previewErrors: Record<string, string>;
  loading: boolean;
  error: string | null;
  success: string | null;
}

// Define the overall state shape
interface EventState {
  events: Event[];
  filteredEvents: Event[];
  eventsById: { [key: string]: Event };
  loading: boolean;
  error: string | null;
  success: string | null;
  uniqueLocations: string[];
  eventTypes: string[];
  searchQuery: string;
  selectedType: string;
  selectedLocation: string;
  creation: EventCreationState;
}

// Initial state for event creation
const initialEventCreationState: EventCreationState = {
  formData: {
    title: '',
    description: '',
    start_date: new Date().toISOString().split('T')[0],
    start_time: '',
    end_date: new Date().toISOString().split('T')[0],
    end_time: '',
    location_link: '',
    type: 'networking',
    created_by: '',
    capacity: 0,
    website: '',
    judges_emails: '',
    is_virtual: false,
    stages: [],
    errors: {},
  },
  stages: [
    {
      id: '1',
      name: '',
      description: '',
      start_date: '',
      start_time: '',
      end_date: '',
      end_time: '',
    },
  ],
  fields: [],
  eventId: null,
  bannerPreview: null,
  step: 1,
  showQuestionModal: false,
  questionStep: 1,
  newQuestion: {
    id: 0,
    label: '',
    type: '',
    required: false,
    options: [''],
  },
  activeTab: 'edit',
  previewFormData: {},
  previewErrors: {},
  loading: false,
  error: null,
  success: null,
};

// Initial state
const initialState: EventState = {
  events: [],
  filteredEvents: [],
  eventsById: {},
  loading: false,
  error: null,
  success: null,
  uniqueLocations: ['All Locations'],
  eventTypes: ['All Types'],
  searchQuery: '',
  selectedType: 'All Types',
  selectedLocation: 'All Locations',
  creation: initialEventCreationState,
};

// Fetch all events
export const fetchEvents = createAsyncThunk(
  'event/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_CONSTANTS.GET_ALL_EVENTS);
      const events = response.data.events.map((event: any) => ({
        ...event,
        stages: typeof event.stages === 'string' ? JSON.parse(event.stages) : event.stages,
      }));
      return events || [];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || err.response?.data?.message || 'Failed to fetch events'
      );
    }
  }
);
export const fetchEventById = createAsyncThunk(
  'event/fetchEventById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_CONSTANTS.GET_EVENT_BY_ID(id));
      const event = response.data.event;
      return {
        ...event,
        stages: typeof event.stages === 'string' ? JSON.parse(event.stages) : event.stages,

      };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || err.response?.data?.message || 'Failed to fetch event details'
      );
    }
  }
);
export const fetchFormFields = createAsyncThunk(
  'event/fetchFormFields',
  async (eventId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_CONSTANTS.GET_FORM_BY_EVENT(eventId), {
        params: { event_id: eventId },
      });
      if (response.data.forms && Array.isArray(response.data.forms)) {
        return response.data.forms.map((field: any) => ({
          id: field.id || Date.now(),
          label: field.details?.label || '',
          type: field.type || 'text',
          placeholder: field.details?.placeholder || '',
          description: field.details?.description || '',
          required: field.required || false,
          options: field.details?.options || [],
        }));
      }
      return [];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || err.response?.data?.message || 'Failed to fetch form fields'
      );
    }
  }
);

// Fetch an event by ID

// Create an event
export const createEvent = createAsyncThunk(
  'event/createEvent',
  async (
    { formData, stages, file }: { formData: EventCreationState['formData']; stages: Stage[]; file: File | null },
    { rejectWithValue }
  ) => {
    try {
      if (formData.start_date && formData.start_time && formData.end_date && formData.end_time) {
        const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`);
        const endDateTime = new Date(`${formData.end_date}T${formData.end_time}`);
        if (startDateTime >= endDateTime) {
          throw new Error('End date and time must be after start date and time');
        }
      }
      const formattedData = {
        ...formData,
        start_date: formData.start_date,
        start_time: formData.start_time,
        end_date: formData.end_date,
        end_time: formData.end_time,
        is_virtual: formData.is_virtual || false,
        stages: JSON.stringify(
          stages.map((stage, index) => ({
            name: stage.name,
            description: stage.description,
            start_date: stage.start_date,
            start_time: stage.start_time,
            end_date: stage.end_date,
            end_time: stage.end_time,
            order: index + 1,
          }))
        ),
      };

      const formDataToSend = new FormData();
      formDataToSend.append('title', formattedData.title);
      formDataToSend.append('description', formattedData.description);
      formDataToSend.append('location_link', formattedData.location_link);
      formDataToSend.append('start_date', formattedData.start_date);
      formDataToSend.append('start_time', formattedData.start_time);
      formDataToSend.append('end_date', formattedData.end_date);
      formDataToSend.append('end_time', formattedData.end_time);
      formDataToSend.append('created_by', formattedData.created_by);
      formDataToSend.append('type', formattedData.type);
      formDataToSend.append('capacity', formattedData.capacity.toString());
      formDataToSend.append('website', formattedData.website);
      formDataToSend.append('judges_emails', formattedData.judges_emails);
      formDataToSend.append('is_virtual', formattedData.is_virtual.toString());
      formDataToSend.append('stages', formattedData.stages);

      if (file) {
        formDataToSend.append('banner', file);
      }

      const response = await axiosInstance.post(API_CONSTANTS.ADD_EVENT, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.event && response.data.event.id) {
        return response.data.event.id;
      } else {
        throw new Error('Failed to get event ID from response');
      }
    } catch (err: any) {
      return rejectWithValue(
        err.message || err.response?.data?.error || err.response?.data?.message || 'Failed to create event'
      );
    }
  }
);

// Update an event
export const updateEvent = createAsyncThunk(
  'event/updateEvent',
  async (
    { id, formData, stages, file }: { id: string; formData: EventCreationState['formData']; stages: Stage[]; file: File | null },
    { rejectWithValue }
  ) => {
    try {
      if (formData.start_date && formData.start_time && formData.end_date && formData.end_time) {
        const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`);
        const endDateTime = new Date(`${formData.end_date}T${formData.end_time}`);
        if (startDateTime >= endDateTime) {
          throw new Error('End date and time must be after start date and time');
        }
      }
      const formattedData = {
        ...formData,
        start_date: formData.start_date,
        start_time: formData.start_time,
        end_date: formData.end_date,
        end_time: formData.end_time,
        is_virtual: formData.is_virtual || false,
        stages: JSON.stringify(
          stages.map((stage, index) => ({
            name: stage.name,
            description: stage.description,
            start_date: stage.start_date,
            start_time: stage.start_time,
            end_date: stage.end_date,
            end_time: stage.end_time,
            order: index + 1,
          }))
        ),
      };

      const formDataToSend = new FormData();
      formDataToSend.append('title', formattedData.title);
      formDataToSend.append('description', formattedData.description);
      formDataToSend.append('location_link', formattedData.location_link);
      formDataToSend.append('start_date', formattedData.start_date);
      formDataToSend.append('start_time', formattedData.start_time);
      formDataToSend.append('end_date', formattedData.end_date);
      formDataToSend.append('end_time', formattedData.end_time);
      formDataToSend.append('created_by', formattedData.created_by);
      formDataToSend.append('type', formattedData.type);
      formDataToSend.append('capacity', formattedData.capacity.toString());
      formDataToSend.append('website', formattedData.website);
      formDataToSend.append('judges_emails', formattedData.judges_emails);
      formDataToSend.append('is_virtual', formattedData.is_virtual.toString());
      formDataToSend.append('stages', formattedData.stages);

      if (file) {
        formDataToSend.append('banner', file);
      }

      const response = await axiosInstance.put(API_CONSTANTS.EDIT_EVENT(id), formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        ...response.data.event,
        stages: typeof response.data.event.stages === 'string'
          ? JSON.parse(response.data.event.stages)
          : response.data.event.stages,
      };
    } catch (err: any) {
      return rejectWithValue(
        err.message || err.response?.data?.error || err.response?.data?.message || 'Failed to update event'
      );
    }
  }
);

// Save form fields
export const saveFormFields = createAsyncThunk(
  'event/saveFormFields',
  async ({ eventId, fields }: { eventId: string; fields: FormField[] }, { rejectWithValue }) => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('Please login to save form');
      }
      const formFields = fields.map((field, index) => ({
        event_id: eventId,
        type: field.type,
        details: {
          label: field.label,
          placeholder: field.placeholder,
          description: field.description,
          options: ['radio', 'checkbox', 'select'].includes(field.type) ? field.options : undefined,
        },
        order: index + 1,
        required: field.required || false,
      }));

      const response = await axiosInstance.post(API_CONSTANTS.ADD_MANY_FORM, formFields);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || err.response?.data?.message || 'Failed to save form fields'
      );
    }
  }
);
// Creating the event slice
const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<{
        searchQuery?: string;
        selectedType?: string;
        selectedLocation?: string;
      }>
    ) => {
      const { searchQuery, selectedType, selectedLocation } = action.payload;

      if (searchQuery !== undefined) {
        state.searchQuery = searchQuery;
      }
      if (selectedType !== undefined) {
        state.selectedType = selectedType;
      }
      if (selectedLocation !== undefined) {
        state.selectedLocation = selectedLocation;
      }

      let filtered = [...state.events];

      if (state.searchQuery) {
        filtered = filtered.filter(
          (event) =>
            (event.title?.toLowerCase() || '').includes(state.searchQuery.toLowerCase()) ||
            (event.description?.toLowerCase() || '').includes(state.searchQuery.toLowerCase())
        );
      }

      if (state.selectedType !== 'All Types') {
        filtered = filtered.filter(
          (event) => (event.type?.toLowerCase() || '') === state.selectedType.toLowerCase()
        );
      }

      if (state.selectedLocation !== 'All Locations') {
        filtered = filtered.filter(
          (event) => (event.location_link || '') === state.selectedLocation
        );
      }

      state.filteredEvents = filtered;
    },

    clearMessages: (state) => {
      state.error = null;
      state.success = null;
      state.creation.error = null;
      state.creation.success = null;
    },

    resetEventState: (state) => {
      Object.assign(state, initialState);
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.creation.error = action.payload;
    },

    setFormData: (state, action: PayloadAction<Partial<EventCreationState['formData']>>) => {
      state.creation.formData = { ...state.creation.formData, ...action.payload };
    },

    setCreatedBy: (state, action: PayloadAction<string>) => {
      state.creation.formData.created_by = action.payload;
    },

    setStep: (state, action: PayloadAction<number>) => {
      state.creation.step = action.payload;
    },

    setBannerPreview: (state, action: PayloadAction<string | null>) => {
      state.creation.bannerPreview = action.payload;
    },

    addStage: (state) => {
      state.creation.stages.push({
        id: Date.now().toString(),
        name: '',
        description: '',
        start_date: '',
        start_time: '',
        end_date: '',
        end_time: '',
      });
    },

    removeStage: (state, action: PayloadAction<number>) => {
      if (state.creation.stages.length > 1) {
        state.creation.stages = state.creation.stages.filter((_, index) => index !== action.payload);
      }
    },

    updateStage: (
      state,
      action: PayloadAction<{ index: number; field: keyof Stage; value: string }>
    ) => {
      const { index, field, value } = action.payload;
      state.creation.stages[index] = {
        ...state.creation.stages[index],
        [field]: value,
      };
      if (index === 0) {
        state.creation.formData = {
          ...state.creation.formData,
          start_date: state.creation.stages[0].start_date || '',
          end_date: state.creation.stages[0].end_date || '',
          start_time: state.creation.stages[0].start_time || '',
          end_time: state.creation.stages[0].end_time || '',
        };
      }
    },

    setShowQuestionModal: (state, action: PayloadAction<boolean>) => {
      state.creation.showQuestionModal = action.payload;
    },

    setQuestionStep: (state, action: PayloadAction<number>) => {
      state.creation.questionStep = action.payload;
    },

    setNewQuestionType: (state, action: PayloadAction<string | null>) => {
      state.creation.newQuestion.type = action.payload || '';
    },

    updateNewQuestion: (state, action: PayloadAction<Partial<FormField>>) => {
      state.creation.newQuestion = { ...state.creation.newQuestion, ...action.payload };
    },

    addNewQuestionOption: (state) => {
      state.creation.newQuestion.options = [...(state.creation.newQuestion.options || []), ''];
    },

    updateNewQuestionOption: (
      state,
      action: PayloadAction<{ index: number; value: string }>
    ) => {
      const { index, value } = action.payload;
      if (state.creation.newQuestion.options) {
        state.creation.newQuestion.options[index] = value;
      }
    },

    removeNewQuestionOption: (state, action: PayloadAction<number>) => {
      if (state.creation.newQuestion.options && state.creation.newQuestion.options.length > 1) {
        state.creation.newQuestion.options = state.creation.newQuestion.options.filter(
          (_, i) => i !== action.payload
        );
      }
    },

    addField: (state, action: PayloadAction<FormField>) => {
      const field = action.payload;
      if (!field.label.trim() || !field.type) {
        state.creation.error = 'Field must have a non-empty label and type';
        return;
      }
      state.creation.fields.push({
        ...field,
        id: state.creation.fields.length + 1,
      });
    },
    updateField: (
      state,
      action: PayloadAction<{ index: number; updates: Partial<FormField> }>
    ) => {
      const { index, updates } = action.payload;
      state.creation.fields[index] = { ...state.creation.fields[index], ...updates };
    },

    removeField: (state, action: PayloadAction<number>) => {
      const fieldId = action.payload;
      state.creation.fields = state.creation.fields.filter((field) => field.id !== fieldId);
      delete state.creation.previewFormData[fieldId.toString()];
      delete state.creation.previewErrors[fieldId.toString()];
    },

    duplicateField: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const fieldToDuplicate = state.creation.fields[index];
      state.creation.fields.splice(index + 1, 0, {
        ...fieldToDuplicate,
        id: state.creation.fields.length + 1,
      });
    },

    setActiveTab: (state, action: PayloadAction<'edit' | 'preview'>) => {
      state.creation.activeTab = action.payload;
    },

    updatePreviewFormData: (
      state,
      action: PayloadAction<{ fieldId: string; value: any; required: boolean }>
    ) => {
      const { fieldId, value, required } = action.payload;
      state.creation.previewFormData[fieldId] = value;

      if (required && !value) {
        state.creation.previewErrors[fieldId] = 'This field is required';
      } else {
        delete state.creation.previewErrors[fieldId];
      }
    },

    resetCreationState: (state) => {
      state.creation = { ...initialEventCreationState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
        state.filteredEvents = action.payload;
        state.eventsById = action.payload.reduce((acc: { [key: string]: Event }, event: Event) => {
          acc[event.id] = event;
          return acc;
        }, {});
        state.error = null;
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

      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.creation.loading = true;
        state.creation.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.creation.loading = false;
        const event = action.payload;
        state.eventsById[event.id] = event;
        state.error = null;
        let parsedStages: Stage[] = [];
        if (typeof event.stages === 'string') {
          try {
            parsedStages = JSON.parse(event.stages);
          } catch (e) {
            console.error('Failed to parse stages:', e);
            state.creation.error = 'Invalid stages format';
          }
        } else if (Array.isArray(event.stages)) {
          parsedStages = event.stages;
        }
        state.creation.formData = {
          title: event.title || '',
          description: event.description || '',
          start_date: event.start_date || '',
          start_time: event.start_time || '',
          end_date: event.end_date || '',
          end_time: event.end_time || '',
          location_link: event.location_link || '',
          type: event.type || 'networking',
          created_by: event.created_by || '',
          capacity: event.capacity || '',
          website: event.website || '',
          judges_emails: event.judges_emails || '',
          is_virtual: event.is_virtual || false,
          stages: parsedStages,
          errors: {},
        };
        state.creation.stages = parsedStages.length > 0
          ? parsedStages.map((stage: any, index: number) => ({
            id: stage.order ? stage.order.toString() : Date.now().toString(),
            name: stage.name || '',
            description: stage.description || '',
            start_date: stage.start_date || '',
            start_time: stage.start_time || '',
            end_date: stage.end_date || '',
            end_time: stage.end_time || '',
          }))
          : [
            {
              id: '1',
              name: '',
              description: '',
              start_date: '',
              end_date: '',
              start_time: '',
              end_time: '',
            },
          ];
        state.creation.bannerPreview = event.banner || null;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.creation.loading = false;
        state.creation.error = action.payload as string;
      })
      .addCase(fetchFormFields.pending, (state) => {
        state.creation.loading = true;
        state.creation.error = null;
      })
      .addCase(fetchFormFields.fulfilled, (state, action) => {
        state.creation.loading = false;
        state.creation.fields = action.payload;
      })
      .addCase(fetchFormFields.rejected, (state, action) => {
        state.creation.loading = false;
        state.creation.error = action.payload as string;
      })

      .addCase(createEvent.pending, (state) => {
        state.creation.loading = true;
        state.creation.error = null;
        state.creation.success = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.creation.loading = false;
        state.creation.eventId = action.payload;
        state.creation.success = 'Event created successfully!';
        state.creation.step = 2;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.creation.loading = false;
        state.creation.error = action.payload as string;
      })

      .addCase(updateEvent.pending, (state) => {
        state.creation.loading = true;
        state.creation.error = null;
        state.creation.success = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.creation.loading = false;
        state.creation.success = 'Event updated successfully!';
        state.eventsById[action.payload.id] = action.payload;
        state.events = state.events.map((event) =>
          event.id === action.payload.id ? action.payload : event
        );
        state.filteredEvents = state.filteredEvents.map((event) =>
          event.id === action.payload.id ? action.payload : event
        );
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.creation.loading = false;
        state.creation.error = action.payload as string;
      })
      .addCase(saveFormFields.pending, (state) => {
        state.creation.loading = true;
        state.creation.error = null;
        state.creation.success = null;
      })
      .addCase(saveFormFields.fulfilled, (state) => {
        state.creation.loading = false;
        state.creation.success = 'Form fields saved successfully!';
      })
      .addCase(saveFormFields.rejected, (state, action) => {
        state.creation.loading = false;
        state.creation.error = action.payload as string;
      })
  },
});

export const {
  setFilters,
  clearMessages,
  resetEventState,
  setError,
  setFormData,
  setCreatedBy,
  setStep,
  setBannerPreview,
  addStage,
  removeStage,
  updateStage,
  setShowQuestionModal,
  setQuestionStep,
  setNewQuestionType,
  updateNewQuestion,
  addNewQuestionOption,
  updateNewQuestionOption,
  removeNewQuestionOption,
  addField,
  updateField,
  removeField,
  duplicateField,
  setActiveTab,
  updatePreviewFormData,
  resetCreationState,
} = eventSlice.actions;

export const selectEventsById = (state: { event: EventState }) => state.event.eventsById;

export default eventSlice.reducer;