import { configureStore } from '@reduxjs/toolkit';
import investorReducer from './InvestorSlice';

const store = configureStore({
  reducer: {
    investor: investorReducer,
  },
});

// Define the RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;