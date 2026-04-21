import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

export const createPickup = createAsyncThunk('pickups/create', async (pickupData, thunkAPI) => {
    try {
        const response = await api.post('/pickups', pickupData);
        console.log(response.data);
        return response.data;
    } catch (error) {
       console.error('Create pickup error:', error.response?.data);
  return thunkAPI.rejectWithValue(
    error.response?.data?.message || 'Failed to create pickup request.'
  );
    }
});

export const fetchPickups = createAsyncThunk('pickups/fetchAll', async (_, thunkAPI) => {
    try {
        const response = await api.get('/pickups');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue('Failed to fetch pickups.');
    }
});

export const assignPickup = createAsyncThunk('pickups/assign', async ({pickupId, workerId}, thunkAPI) => {
    try {
        const response = await api.put(`/pickups/${pickupId}/assign`, { workerId });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue('Failed to assign pickup.');
    }
});


export const completePickup = createAsyncThunk('pickups/complete', async ({ pickupId, workerPhoto }, thunkAPI) => {
    try {
        const response = await api.put(`/pickups/${pickupId}/complete`, { workerPhoto });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue('Failed to complete pickup.');
    }
});


const pickupSlice = createSlice({
    name: 'pickup',
    initialState: {
        pickups: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchPickups.pending, state => {
                state.status = 'loading';
            })
            .addCase(fetchPickups.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.pickups = action.payload;
            })
            .addCase(fetchPickups.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(createPickup.fulfilled, (state, action) => {
                state.pickups.push(action.payload);
            })
            .addCase(assignPickup.fulfilled, (state, action) => {
                const index = state.pickups.findIndex(p => p._id === action.payload._id);
                if (index !== -1) {
                    state.pickups[index] = action.payload;
                }
            })
            .addCase(completePickup.fulfilled, (state, action) => {
                const index = state.pickups.findIndex(p => p._id === action.payload._id);
                if (index !== -1) {
                    state.pickups[index] = action.payload;
                }
            })
    }
});

export default pickupSlice.reducer;