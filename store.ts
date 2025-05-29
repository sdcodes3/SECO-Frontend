import { configureStore } from '@reduxjs/toolkit';
import investorReducer from './InvestorSlice';
import eventReducer from './EventSlice';

export const store = configureStore({
  reducer: {
    investor: investorReducer,
    event: eventReducer, // Add this reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;