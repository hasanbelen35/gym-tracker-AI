import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { MemberState } from "@/features/member/get-my-programs/types";
import { API } from "@/lib/api";
import { handleApiError } from "../apiErrorHandler";
import { UpdateMemberProfileData } from "@/features/member/profile/types";

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
    profile: null,
    programs: [],
    loading: false,
    error: null,
};

export const fetchCurrentMember = createAsyncThunk(
    "member/fetchCurrentMember",
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get("/member/me");
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            return rejectWithValue(err.response?.data?.message || "Profile datas can not fetched.");
        }
    }
);

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

// GET MEMBER'S PROGRAMS 
export const fetchMemberPrograms = createAsyncThunk(
    'member/fetchMemberPrograms',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/member/my-programs');
            return response.data.data;
        } catch (error) {
            return handleApiError(
                error,
                rejectWithValue,
                "Programlarınız yüklenirken bir hata oluştu."
            );
        }
    }
);

// UPDATE MEMBER PROFILE
export const updateMemberProfileData = createAsyncThunk(
    'member/updateProfile',
    async (data: UpdateMemberProfileData, { rejectWithValue }) => {
        try {
            const response = await API.put('/member/edit-profile', data);
            return response.data.data;
        } catch (error) {
            return handleApiError(
                error,
                rejectWithValue,
                "Profil güncellenirken bir hata oluştu."
            );
        }
    }
);

const memberSlice = createSlice({
    name: "member",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchCurrentMember
            .addCase(fetchCurrentMember.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCurrentMember.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchCurrentMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // fetchMyTrainer
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
            // fetchMemberPrograms
            .addCase(fetchMemberPrograms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMemberPrograms.fulfilled, (state, action) => {
                state.loading = false;
                state.programs = action.payload;
            })
            .addCase(fetchMemberPrograms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // updateMemberProfile 
            .addCase(updateMemberProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMemberProfile.fulfilled, (state, action) => {
                state.loading = false;
                if (state.profile) {
                    state.profile = { ...state.profile, ...action.payload };
                } else {
                    state.profile = action.payload;
                }
            })
            .addCase(updateMemberProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default memberSlice.reducer;