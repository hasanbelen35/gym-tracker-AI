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
}

const initialState: GymState = {
    profile: null,
    loading: false,
    error: null,
};

// GYM PROFİL BİLGİLERİNİ GETİR
export const fetchGymProfile = createAsyncThunk(
    'gym/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/gym/getAllGym'); 
           // console.log(response.data.data)
            return response.data.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Gym bilgileri alınamadı.");
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
            });
    },
});

export const { clearGymError } = gymSlice.actions;
export default gymSlice.reducer;