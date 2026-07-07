// src/store/slices/gymSessionSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = axios.create({
    baseURL: process.env.SERVER_API_URL || "http://localhost:5000/api",
    withCredentials: true,
});

interface Session {
    id: number;
    memberId: number;
    memberName: string;
    checkIn: string;
    checkOut: string | null;
}

interface GymSessionState {
    allSessions: Session[];
    activeSessions: Session[];
    loading: boolean;
    error: string | null;
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log(error)
            return rejectWithValue(error.response?.data?.message || "Oturumlar alınamadı.");
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log(error)

            return rejectWithValue(error.response?.data?.message || "Aktif oturumlar alınamadı.");
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