import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from 'axios';

// --- INTERFACES ---

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

export interface SetInput {
    setNumber: number;
    targetReps?: string;
    targetWeight?: number;
    rir?: number;
}

export interface ProgramExerciseInput {
    exercisePublicId: string;
    orderIndex: number;
    notes?: string;
    sets: SetInput[];
}

export interface ProgramDayInput {
    dayOrder: number;
    dayName: string;
    isRestDay?: boolean;
    exercises: ProgramExerciseInput[];
}

export interface CreateProgramPayload {
    memberPublicId: string;
    title: string;
    type?: "WORKOUT" | "DIET";
    splitType: "PPL" | "UPPER_LOWER" | "FULL_BODY" | "BRO_SPLIT" | "CUSTOM";
    days: ProgramDayInput[];
}

export interface SetDetail {
    id?: number;
    publicId?: string;
    setNumber: number;
    targetReps?: string | null;
    targetWeight?: number | null;
    rir?: number | null;
}

export interface ProgramExerciseDetail {
    id?: number;
    publicId?: string;
    exerciseId: number;
    orderIndex: number;
    notes?: string | null;
    sets: SetDetail[];
    exercise?: Exercise;
}

export interface ProgramDayDetail {
    id?: number;
    publicId?: string;
    dayOrder: number;
    dayName: string;
    isRestDay: boolean;
    exercises: ProgramExerciseDetail[];
}

export interface Program {
    id: number;
    publicId: string;
    title: string;
    type: string;
    splitType: string;
    isActive: boolean;
    createdAt: string;
    days?: ProgramDayDetail[];
}

export interface FilterOptions {
    categories: string[];
    equipments: string[];
    targetMuscles: string[];
}

export interface ExerciseState {
    exercises: Exercise[];
    programs: Program[];
    filterOptions: FilterOptions;
    loading: boolean;
    programCreating: boolean;
    error: string | null;
    successMessage: string | null;
    filters: {
        search: string;
        category: string;
        equipment: string;
        targetMuscle: string;
    };
}

const initialState: ExerciseState = {
    exercises: [],
    programs: [],
    filterOptions: {
        categories: [],
        equipments: [],
        targetMuscles: [],
    },
    loading: false,
    programCreating: false,
    error: null,
    successMessage: null,
    filters: {
        search: "",
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

// --- ASYNC THUNKS ---

export const fetchExercises = createAsyncThunk(
    "exercises/fetchExercises",
    async (filters: { category?: string; equipment?: string; targetMuscle?: string }, { rejectWithValue }) => {
        try {
            const response = await API.get('/exercises/getExercisesByQuery', {
                params: filters,
            });
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(err.response?.data?.error || err.response?.data?.message || "Egzersizler alınamadı.");
        }
    }
);

export const createProgram = createAsyncThunk(
    "exercises/createProgram",
    async (programData: CreateProgramPayload, { rejectWithValue }) => {
        try {
            const response = await API.post('/exercises/create-program', programData);

            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(err.response?.data?.error || err.response?.data?.message || "Program oluşturulamadı.");
        }
    }
);

// --- SLICE ---

const exerciseSlice = createSlice({
    name: "exercises",
    initialState,
    reducers: {
        setSearchFilter(state, action: PayloadAction<string>) {
            state.filters.search = action.payload;
        },
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
        clearMessages(state) {
            state.error = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Exercises
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
            })
            // Create Program
            .addCase(createProgram.pending, (state) => {
                state.programCreating = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(createProgram.fulfilled, (state, action) => {
                state.programCreating = false;
                state.successMessage = "Antrenman programı başarıyla oluşturuldu!";
                state.programs.unshift(action.payload);
            })
            .addCase(createProgram.rejected, (state, action) => {
                state.programCreating = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    setSearchFilter,
    setCategoryFilter,
    setEquipmentFilter,
    setTargetMuscleFilter,
    clearFilters,
    clearMessages,
} = exerciseSlice.actions;

export default exerciseSlice.reducer;