import { configureStore } from '@reduxjs/toolkit';
import investorReducer from '../slices/InvestorSlice';
import eventReducer from '../slices/EventSlice';

export const store = configureStore({
  reducer: {
    investor: investorReducer,
    event: eventReducer, // Add this reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;