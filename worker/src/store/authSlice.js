import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

// Worker Login Thunk
export const workerLogin = createAsyncThunk(
  'auth/workerLogin',
  async (credentials, thunkAPI) => {
    try {
      const response = await api.post('/auth/login', credentials);
      // Ensure the logged-in user is actually a worker
      if (response.data.role !== 'worker') {
        // Automatically log them out from the backend if they have the wrong role
        await api.post('/auth/logout');
        return thunkAPI.rejectWithValue('Access denied. Worker credentials required.');
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Login failed.'
      );
    }
  }
);

// Worker Register Thunk
export const workerRegister = createAsyncThunk(
  'auth/workerRegister',
  async (userData, thunkAPI) => {
    try {
      const response = await api.post('/auth/register', { ...userData, role: 'worker' });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Registration failed.'
      );
    }
  }
);

// Worker Logout Thunk
export const workerLogout = createAsyncThunk(
  'auth/workerLogout',
  async (_, thunkAPI) => {
    try {
      await api.post('/auth/logout');
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue('Logout failed.');
    }
  }
);

const initialState = {
  workerUser: JSON.parse(localStorage.getItem('workerUser')) || null,
  isLocationEnabled: JSON.parse(localStorage.getItem('workerLocationTracking')) || false,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    toggleLocationTracking: (state) => {
      state.isLocationEnabled = !state.isLocationEnabled;
      localStorage.setItem('workerLocationTracking', state.isLocationEnabled);
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(workerLogin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(workerLogin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.workerUser = action.payload;
        localStorage.setItem('workerUser', JSON.stringify(action.payload));
        if (action.payload.token) {
          localStorage.setItem('worker_token', action.payload.token);
        }
      })
      .addCase(workerLogin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Logout
      .addCase(workerLogout.fulfilled, (state) => {
        state.workerUser = null;
        localStorage.removeItem('workerUser');
        localStorage.removeItem('worker_token');
        state.status = 'idle';
      })
      // Register
      .addCase(workerRegister.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(workerRegister.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.workerUser = action.payload;
        localStorage.setItem('workerUser', JSON.stringify(action.payload));
        if (action.payload.token) {
          localStorage.setItem('worker_token', action.payload.token);
        }
      })
      .addCase(workerRegister.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearError, toggleLocationTracking } = authSlice.actions;
export default authSlice.reducer;
