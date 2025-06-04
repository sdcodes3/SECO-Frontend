import { configureStore } from '@reduxjs/toolkit';
import investorReducer from '../slices/InvestorSlice';
import eventReducer from '../slices/EventSlice';
import eventApplicationReducer from '../slices/EventApplicationSlice';
import authReducer, { fetchCurrentUser } from '../slices/AuthSlice';

export const store = configureStore({
  reducer: {
    investor: investorReducer,
    event: eventReducer,
    eventApplication: eventApplicationReducer,
    auth: authReducer,
  },
});
store.dispatch(fetchCurrentUser());
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;