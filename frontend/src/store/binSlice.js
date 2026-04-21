import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

export const fetchBins = createAsyncThunk('bins/fetchAll', async (_, thunkAPI) => {
    try {
        const response = await api.get('/bins');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue('Could not fetch bins');
    }
});

export const fetchBinById = createAsyncThunk('bins/fetchById', async (id, thunkAPI) => {
    try {
        const response = await api.get(`/bins/${id}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue('Could not fetch bin');
    }
});

const binSlice = createSlice({
    name: 'bin',
    initialState: {
        bins: [],
        currentBin: null,
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchBins.pending, state => {
                state.status = 'loading';
            })
            .addCase(fetchBins.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.bins = action.payload;
            })
            .addCase(fetchBins.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchBinById.pending, state => {
                state.status = 'loading';
            })
            .addCase(fetchBinById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentBin = action.payload;
            })
            .addCase(fetchBinById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
    }
});

export default binSlice.reducer;