import { configureStore } from '@reduxjs/toolkit';
import investorReducer from '../slices/InvestorSlice';
import eventReducer from '../slices/EventSlice';
import eventApplicationReducer from '../slices/EventApplicationSlice'; // Add the event application reducer

export const store = configureStore({
  reducer: {
    investor: investorReducer,
    event: eventReducer,
    eventApplication: eventApplicationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;