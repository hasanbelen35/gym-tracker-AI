import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { DetailedProgram, MemberState } from "@/features/member/get-my-programs/types";
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
    workoutLogLoading: false,
    workoutLogSuccess: false,
    pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
    },
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

export const fetchMemberPrograms = createAsyncThunk(
    'member/fetchMemberPrograms',
    async (params: { onlyActive?: boolean; page?: number; limit?: number } = {}, { rejectWithValue }) => {
        try {
            const response = await API.get('/member/my-programs', {
                params: params
            });
            return {
                data: response.data.data,
                pagination: response.data.pagination,
                params: params 
            };
        } catch (error) {
            return handleApiError(
                error,
                rejectWithValue,
                "Programlarınız yüklenirken bir hata oluştu."
            );
        }
    }
);

export const updateMemberProfile = createAsyncThunk(
    'member/updateProfile',
    async (data: UpdateMemberProfileData | UpdateProfilePayload, { rejectWithValue }) => {
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
            .addCase(fetchMemberPrograms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMemberPrograms.fulfilled, (state, action) => {
                state.loading = false;
                const { data, pagination, params } = action.payload;

                if (params?.onlyActive) {
                    const archivedOnly = state.programs.filter((p) => !p.isActive);
                    state.programs = [...data, ...archivedOnly];
                } else {
                    const currentPage = params?.page || 1;

                    if (currentPage === 1) {
                        const activeOnly = state.programs.filter((p) => p.isActive);
                        state.programs = [...activeOnly, ...data];
                    } else {
                        const existingIds = new Set(state.programs.map((p) => p.id));
                        const newItems = data.filter((p: DetailedProgram) => !existingIds.has(p.id));
                         state.programs = [...state.programs, ...newItems];
                    }

                    state.pagination = pagination;
                }
            })
            .addCase(fetchMemberPrograms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
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