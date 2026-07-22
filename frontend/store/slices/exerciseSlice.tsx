import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from 'axios';

// Exercise Interface
export interface Exercise {
    id: number;
    publicId: string;
    name: string;
    category?: string;
    bodyPart?: string;
    equipment?: string;
    targetMuscle?: string;
    instructions?: string;
    gifUrl?: string;
}

export interface ExerciseState {
    exercises: Exercise[];
    loading: boolean;
    error: string | null;
    filters: {
        category: string;
        equipment: string;
        targetMuscle: string;
    };
}

const initialState: ExerciseState = {
    exercises: [],
    loading: false,
    error: null,
    filters: {
        category: "",
        equipment: "",
        targetMuscle: "",
    },
};

interface ApiErrorResponse {
    error?: string;
    message?: string;
}

const API = axios.create({
    baseURL: process.env.SERVER_API_URL || "http://localhost:5000/api",
    withCredentials: true,
});

// fetch exercises 
export const fetchExercises = createAsyncThunk(
    "exercises/fetchExercises",
    async (filters: { category?: string; equipment?: string; targetMuscle?: string }, { rejectWithValue }) => {
        try {
            const response = await API.get('/exercises/getExercisesByQuery', {
                params: filters,
            });
            console.log(response.data.data);
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(err.response?.data?.error || err.response?.data?.message || "Egzersizler alınamadı.");
        }
    }
);

const exerciseSlice = createSlice({
    name: "exercises",
    initialState,
    reducers: {
        setCategoryFilter(state, action: PayloadAction<string>) {
            state.filters.category = action.payload;
        },
        setEquipmentFilter(state, action: PayloadAction<string>) {
            state.filters.equipment = action.payload;
        },
        setTargetMuscleFilter(state, action: PayloadAction<string>) {
            state.filters.targetMuscle = action.payload;
        },
        clearFilters(state) {
            state.filters = initialState.filters;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchExercises.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExercises.fulfilled, (state, action) => {
                state.loading = false;
                state.exercises = action.payload;
            })
            .addCase(fetchExercises.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    setCategoryFilter,
    setEquipmentFilter,
    setTargetMuscleFilter,
    clearFilters,
} = exerciseSlice.actions;

export default exerciseSlice.reducer;