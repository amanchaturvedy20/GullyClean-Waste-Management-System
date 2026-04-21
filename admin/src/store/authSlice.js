import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

const adminUser = JSON.parse(localStorage.getItem('adminUser'));

export const adminLogin = createAsyncThunk('auth/adminLogin', async (credentials, thunkAPI) => {
  try {
    const { email, password } = credentials;
    const response = await api.post('/auth/login', { email, password });
    
    // Ensure the logging in user is actually an admin
    if (response.data.role !== 'admin') {
       return thunkAPI.rejectWithValue('Access Denied: Not an administrator.');
    }

    localStorage.setItem('adminUser', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const adminLogout = createAsyncThunk('auth/adminLogout', async () => {
  await api.post('/auth/logout');
  localStorage.removeItem('adminUser');
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: adminUser,
    status: 'idle',
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
      .addCase(adminLogin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        if (action.payload.token) {
          localStorage.setItem('admin_token', action.payload.token);
        }
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.user = null;
      })
      .addCase(adminLogout.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem('admin_token');
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
