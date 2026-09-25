import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "@/lib/api";
import {
    NutritionState,
    CreateDietProgramPayload,
    AxiosErrorResponse,
    NutritionProgram,
} from "@/types/nutrition.types";

const initialState: NutritionState = {
    programs: [],
    currentProgram: null,
    loading: false,
    error: null,
    successMessage: null,
};

export const createNutritionProgram = createAsyncThunk<
    NutritionProgram,
    CreateDietProgramPayload,
    { rejectValue: string }
>(
    "nutrition/createNutritionProgram",
    async (payload, { rejectWithValue }) => {
        try {
            const { memberPublicId, ...bodyData } = payload;
            const response = await API.post(
                `/nutrition/createNutritionProgram/${memberPublicId}`,
                bodyData
            );
            return response.data.data;
        } catch (error: unknown) {
            const err = error as AxiosErrorResponse;
            return rejectWithValue(
                err.response?.data?.message || "Failed to create diet program."
            );
        }
    }
);

export const deleteNutritionProgram = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>(
    "nutrition/deleteNutritionProgram",
    async (programPublicId, { rejectWithValue }) => {
        try {
            await API.delete(`/nutrition/deleteNutritionProgram/${programPublicId}`);
            return programPublicId;
        } catch (error: unknown) {
            const err = error as AxiosErrorResponse;
            return rejectWithValue(
                err.response?.data?.message || "Failed to delete diet program."
            );
        }
    }
);

export const fetchNutritionProgramDetail = createAsyncThunk<
    NutritionProgram,
    string,
    { rejectValue: string }
>(
    "nutrition/fetchNutritionProgramDetail",
    async (programPublicId, { rejectWithValue }) => {
        try {
            const response = await API.get(`/nutrition/getProgramDetail/${programPublicId}`);
            return response.data.data;
        } catch (error: unknown) {
            const err = error as AxiosErrorResponse;
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch diet program details."
            );
        }
    }
);

export const fetchMemberNutritionPrograms = createAsyncThunk<
    NutritionProgram[],
    string,
    { rejectValue: string }
>(
    "nutrition/fetchMemberNutritionPrograms",
    async (memberPublicId, { rejectWithValue }) => {
        try {
            const response = await API.get(
                `/nutrition/getMembersNutritionPrograms/${memberPublicId}`
            );
            return response.data.data;
        } catch (error: unknown) {
            const err = error as AxiosErrorResponse;
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch member diet programs."
            );
        }
    }
);

const nutritionSlice = createSlice({
    name: "nutrition",
    initialState,
    reducers: {
        clearNutritionMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        },
        clearCurrentProgram: (state) => {
            state.currentProgram = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createNutritionProgram.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(createNutritionProgram.fulfilled, (state, action) => {
                state.loading = false;
                state.programs.unshift(action.payload);
                state.successMessage = "Diet program successfully created.";
            })
            .addCase(createNutritionProgram.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "An unexpected error occurred during creation.";
            })
            .addCase(deleteNutritionProgram.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteNutritionProgram.fulfilled, (state, action) => {
                state.loading = false;
                state.programs = state.programs.filter((p) => p.publicId !== action.payload);
                if (state.currentProgram?.publicId === action.payload) {
                    state.currentProgram = null;
                }
                state.successMessage = "Diet program successfully deleted.";
            })
            .addCase(deleteNutritionProgram.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "An unexpected error occurred during deletion.";
            })
            .addCase(fetchNutritionProgramDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNutritionProgramDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProgram = action.payload;
            })
            .addCase(fetchNutritionProgramDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "An unexpected error occurred while fetching details.";
            })
            .addCase(fetchMemberNutritionPrograms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMemberNutritionPrograms.fulfilled, (state, action) => {
                state.loading = false;
                state.programs = action.payload;
            })
            .addCase(fetchMemberNutritionPrograms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "An unexpected error occurred while fetching programs.";
            });
    },
});

export const { clearNutritionMessages, clearCurrentProgram } = nutritionSlice.actions;
export default nutritionSlice.reducer;