import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { API } from "@/lib/api";

interface ApiErrorResponse {
    message?: string;
}

interface FetchSessionsParams {
    page?: number;
    limit?: number;
}

export interface GymSessionData {
    id?: number;
    memberId?: number;
    memberName?: string;
    gymId?: number;
    checkIn: string;
    checkOut?: string | null;
    duration?: number;
    gym?: {
        name: string;
    };
}

export interface GymSessionState {
    allSessions: GymSessionData[];
    activeSessions: GymSessionData[];
    loading: boolean;
    error: string | null;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalRecords: number;
        limit: number;
    };
}

const initialState: GymSessionState = {
    allSessions: [],
    activeSessions: [],
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        limit: 50
    }
};

export const fetchGymSessions = createAsyncThunk(
    'gym/fetchSessions',
    async (params: FetchSessionsParams | undefined, { rejectWithValue }) => {
        try {
            const page = params?.page || 1;
            const limit = params?.limit || 50;
            
            const response = await API.get('/session/gym', {
                params: { page, limit }
            });
            return response.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(err.response?.data?.message || "Oturumlar alınamadı.");
        }
    }
);

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
            .addCase(fetchGymSessions.pending, (state) => { 
                state.loading = true; 
                state.error = null; 
            })
            .addCase(fetchGymSessions.fulfilled, (state, action) => {
                state.loading = false;
                state.allSessions = action.payload.data;
                state.pagination = action.payload.meta;
            })
            .addCase(fetchGymSessions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchActiveSessions.pending, (state) => { 
                state.loading = true; 
                state.error = null; 
            })
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