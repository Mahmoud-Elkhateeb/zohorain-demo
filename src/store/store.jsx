import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/authSlice';
import { auth } from '@/services/api/firebase';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    
  },
});