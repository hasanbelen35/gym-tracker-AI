// src/store/slices/gymSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = axios.create({
    baseURL: process.env.SERVER_API_URL || "http://localhost:5000/api",
    withCredentials: true,
});

interface GymState {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    profile: any | null;
    loading: boolean;
    error: string | null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    members: any[];
    membersLoading: boolean;
    membersError: string | null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trainers: any[];
    trainersLoading: boolean;
    trainersError: string | null;
}

const initialState: GymState = {
    profile: null,
    loading: false,
    error: null,

    members: [],
    membersLoading: false,
    membersError: null,

    trainers: [],
    trainersLoading: false,
    trainersError: null,
};

// GYM PROFİL BİLGİLERİNİ GETİR
export const fetchGymProfile = createAsyncThunk(
    'gym/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/gym/getAllGym');
            return response.data.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Gym bilgileri alınamadı.");
        }
    }
);

// GET ALL MEMBERS
export const fetchAllMembers = createAsyncThunk(
    'gym/fetchAllMembers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/gym/getAllMembers');
            return response.data.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Üyeler alınamadı.");
        }
    }
);

// GET ALL TRAINERS 
export const fetchAllTrainers = createAsyncThunk(
    'gym/fetchAllTrainers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/gym/getAllTrainers');
            return response.data.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Antrenörler alınamadı.");
        }
    }
);

const gymSlice = createSlice({
    name: 'gym',
    initialState,
    reducers: {
        clearGymError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGymProfile.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchGymProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchGymProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchAllMembers.pending, (state) => { state.membersLoading = true; state.membersError = null; })
            .addCase(fetchAllMembers.fulfilled, (state, action) => {
                state.membersLoading = false;
                state.members = action.payload;
            })
            .addCase(fetchAllMembers.rejected, (state, action) => {
                state.membersLoading = false;
                state.membersError = action.payload as string;
            })

            .addCase(fetchAllTrainers.pending, (state) => { state.trainersLoading = true; state.trainersError = null; })
            .addCase(fetchAllTrainers.fulfilled, (state, action) => {
                state.trainersLoading = false;
                state.trainers = action.payload;
            })
            .addCase(fetchAllTrainers.rejected, (state, action) => {
                state.trainersLoading = false;
                state.trainersError = action.payload as string;
            });
    },
});

export const { clearGymError } = gymSlice.actions;
export default gymSlice.reducer;