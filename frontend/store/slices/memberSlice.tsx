import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { MemberState } from "@/types/types";
import { API } from "@/lib/api"; 

interface UpdateProfilePayload {
    age?: number;
    height?: number;
    weight?: number;
    gender?: "MALE" | "FEMALE";
    medicalNotes?: string;
    avatarUrl?: string;
}

const initialState: MemberState = {
    trainer: null,
    assignmentStatus: null,
    loading: false,
    error: null,
};

export const fetchMyTrainer = createAsyncThunk(
    "member/fetchMyTrainer",
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get("/member/getMyTrainerData");
            return response.data.data; 
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            return rejectWithValue(err.response?.data?.message || "Trainer data can not fetched.");
        }
    }
);

export const updateMemberProfile = createAsyncThunk(
    "member/updateProfile",
    async (profileData: UpdateProfilePayload, { rejectWithValue }) => {
        try {
            const response = await API.put("/member/profile/complete", profileData);
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<{ message?: string; details?: Array<{ message: string }> }>;
            const errorMessage = err.response?.data?.details?.[0]?.message ||
                err.response?.data?.message ||
                "Profile can not updated.";
            return rejectWithValue(errorMessage);
        }
    }
);

const memberSlice = createSlice({
    name: "member",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // --- fetchMyTrainer ---
            .addCase(fetchMyTrainer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyTrainer.fulfilled, (state, action) => {
                state.loading = false;
                state.trainer = action.payload.trainer;
                state.assignmentStatus = action.payload.assignmentStatus;
            })
            .addCase(fetchMyTrainer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // --- updateMemberProfile ---
            .addCase(updateMemberProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMemberProfile.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateMemberProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default memberSlice.reducer;