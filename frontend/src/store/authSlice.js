import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

const user = JSON.parse(localStorage.getItem('user'));

// Signup
export const signup = createAsyncThunk('auth/register', async (user, thunkAPI) => {
  try {
    const response = await api.post('/auth/register', user,{
      headers: { 'Content-Type': 'application/json' }
    });
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// ✅ Login (fixed: handles identifier → email/phone automatically)
export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const { identifier, password } = credentials;

    let payload = { password };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(identifier)) {
      payload.email = identifier;
    } else {
      payload.phone = identifier;
    }

    const response = await api.post('/auth/login', payload);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Logout
export const logout = createAsyncThunk('auth/logout', async () => {
  await api.post('/auth/logout');
  localStorage.removeItem('user');
});

// Fetch workers
export const fetchWorkers = createAsyncThunk('auth/fetchWorkers', async (_, thunkAPI) => {
  try {
    const response = await api.get('/auth/workers');
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: user,
    workers: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    reset: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(fetchWorkers.fulfilled, (state, action) => {
        state.workers = action.payload;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
