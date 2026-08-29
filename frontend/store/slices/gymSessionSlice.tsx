// src/store/slices/gymSessionSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { GymSessionState } from '@/types/types';
import { API } from "@/lib/api";

interface ApiErrorResponse {
    message?: string;
}

const initialState: GymSessionState = {
    allSessions: [],
    activeSessions: [],
    loading: false,
    error: null,
};

// FETCH ALL SESSIONS IN GYM
export const fetchGymSessions = createAsyncThunk(
    'gym/fetchSessions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/session/gym');
            return response.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(err.response?.data?.message || "Oturumlar alınamadı.");
        }
    }
);

// FETCH ACTIVE SESSIONS NOW
export const fetchActiveSessions = createAsyncThunk(
    'gym/fetchActive',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/session/gym/active');
            return response.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(err.response?.data?.message || "Aktif oturumlar alınamadı.");
        }
    }
);

const gymSessionSlice = createSlice({
    name: 'gymSession',
    initialState,
    reducers: {
        clearGymSessionError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            // ALL SESSIONS
            .addCase(fetchGymSessions.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchGymSessions.fulfilled, (state, action) => {
                state.loading = false;
                state.allSessions = action.payload;
            })
            .addCase(fetchGymSessions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ACTIVE SESSIONS
            .addCase(fetchActiveSessions.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchActiveSessions.fulfilled, (state, action) => {
                state.loading = false;
                state.activeSessions = action.payload;
            })
            .addCase(fetchActiveSessions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearGymSessionError } = gymSessionSlice.actions;
export default gymSessionSlice.reducer;