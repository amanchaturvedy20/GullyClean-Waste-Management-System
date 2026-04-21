import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import binReducer from './binSlice';
import pickupReducer from './pickupSlice';
import notificationsReducer from './notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bin: binReducer,
    pickup: pickupReducer,
    notifications: notificationsReducer,
  },
});
