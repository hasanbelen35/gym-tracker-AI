import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API = axios.create({
    baseURL: process.env.SERVER_API_URL || "http://localhost:5000/api",
    withCredentials: true,
});

interface SessionHistoryItem {
    id: number;
    memberId: number;
    gymId: number;
    checkIn: string;
    checkOut: string | null;
    duration: number;
    gym: {
        name: string;
    };
}

interface SessionState {
    isActive: boolean;
    loading: boolean;
    error: string | null;
    history: SessionHistoryItem[];
}

const initialState: SessionState = {
    isActive: false,
    loading: false,
    error: null,
    history: [],
};

// Check-in
export const checkIn = createAsyncThunk('session/checkIn', async (gymId: number, { rejectWithValue }) => {
    try {
        const response = await API.post('/session/checkin', { gymId });
        return response.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Antrenman başlatılamadı.");
    }
});

// check out
export const checkOut = createAsyncThunk('session/checkOut', async (_, { rejectWithValue }) => {
    try {
        const response = await API.post('/session/checkout');
        return response.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Oturum kapatılamadı.");
    }
});

export const getSessionsByUser = createAsyncThunk(
    'session/getSessionsByUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/session/my', {
                params: {
                    t: Date.now(),
                },
            });
            return response.data;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Oturumlar alınamadı.");
        }
    }
);

const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        clearSessionError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            // Check-in
            .addCase(checkIn.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(checkIn.fulfilled, (state) => { state.loading = false; state.isActive = true; })
            .addCase(checkIn.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            // Check-out
            .addCase(checkOut.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(checkOut.fulfilled, (state) => { state.loading = false; state.isActive = false; })
            .addCase(checkOut.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            // Get sessions by user — history buraya yazılıyor
            .addCase(getSessionsByUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getSessionsByUser.fulfilled, (state, action) => {
                state.loading = false;
                state.history = action.payload;
            })
            .addCase(getSessionsByUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearSessionError } = sessionSlice.actions;
export default sessionSlice.reducer;