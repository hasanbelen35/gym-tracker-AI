// src/store/slices/gymSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { GymState } from "@/types/types";
import { API } from "@/lib/api";

interface ApiErrorResponse {
    message?: string;
}

export interface PaginationInfo {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

type MemberAssignmentStatus = "PENDING" | "ASSIGNED" | "UNASSIGNED";

interface FetchMembersByStatusPayload {
    data: GymState["pendingMembers"];
    status: MemberAssignmentStatus;
}

const initialState: GymState = {
    profile: null,
    loading: false,
    error: null,

    members: [],
    pagination: null,
    membersLoading: false,
    membersError: null,

    trainers: [],
    trainersLoading: false,
    trainersError: null,

    // --- YENİ ÜYE DETAY & SAYFALAMA STATE YAPISI ---
    memberDetail: null,
    memberDetailLoading: false,
    memberDetailError: null,

    memberMeasurements: [],
    memberMeasurementsPagination: null,
    memberMeasurementsLoading: false,
    memberMeasurementsError: null,

    memberSessions: [],
    memberSessionsPagination: null,
    memberSessionsLoading: false,
    memberSessionsError: null,

    memberPrograms: [],
    memberProgramsPagination: null,
    memberProgramsLoading: false,
    memberProgramsError: null,
    // ---------------------------------------------

    trainerDetail: null,
    trainerDetailLoading: false,
    trainerDetailError: null,

    assignmentLoading: false,
    assignmentError: null,

    pendingMembers: [],
    assignedMembers: [],
    unassignedMembers: [],
    statusMembersLoading: false,
    statusMembersError: null,
};

// GET GYM PROFILE DATA
export const fetchGymProfile = createAsyncThunk(
    "gym/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get("/gym/getAllGym");
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(
                err.response?.data?.message || "Gym bilgileri alınamadı."
            );
        }
    }
);

// GET ALL MEMBERS (PAGINATED)
export const fetchAllMembers = createAsyncThunk(
    "gym/fetchAllMembers",
    async (
        { page = 1, limit = 10 }: { page?: number; limit?: number } = {},
        { rejectWithValue }
    ) => {
        try {
            const response = await API.get(
                `/gym/getAllMembers?page=${page}&limit=${limit}`
            );

            return {
                data: response.data.data,
                pagination: response.data.pagination,
            };
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(
                err.response?.data?.message || "Üyeler alınamadı."
            );
        }
    }
);

// GET ALL TRAINERS
export const fetchAllTrainers = createAsyncThunk(
    "gym/fetchAllTrainers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get("/gym/getAllTrainers");
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(
                err.response?.data?.message || "Antrenörler alınamadı."
            );
        }
    }
);

// REMOVE MEMBER FROM GYM
export const removeMemberFromGym = createAsyncThunk(
    "gym/removeMemberFromGym",
    async (memberPublicId: string, { rejectWithValue }) => {
        try {
            const response = await API.delete(
                `/gym/deleteMemberFromGym/${memberPublicId}`
            );
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(
                err.response?.data?.message || "Üye silinemedi."
            );
        }
    }
);

// REMOVE TRAINER FROM GYM
export const removeTrainerFromGym = createAsyncThunk(
    "gym/removeTrainerFromGym",
    async (trainerPublicId: string, { rejectWithValue }) => {
        try {
            const response = await API.delete(
                `/gym/deleteTrainerFromGym/${trainerPublicId}`
            );
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(
                err.response?.data?.message || "Antrenör silinemedi."
            );
        }
    }
);

// 1. GET MEMBER PROFILE DETAIL
export const fetchMemberProfile = createAsyncThunk(
    "gym/fetchMemberProfile",
    async (memberPublicId: string, { rejectWithValue }) => {
        try {
            const response = await API.get(
                `/gym/members/${memberPublicId}/profile`
            );
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(
                err.response?.data?.message || "Üye profili alınamadı."
            );
        }
    }
);

// 2. GET MEMBER MEASUREMENTS (PAGINATED)
export const fetchMemberMeasurements = createAsyncThunk(
    "gym/fetchMemberMeasurements",
    async (
        { memberPublicId, page = 1, limit = 10 }: { memberPublicId: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await API.get(
                `/gym/members/${memberPublicId}/measurements?page=${page}&limit=${limit}`
            );
            return {
                data: response.data.data.data,
                pagination: response.data.data.pagination,
            };
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(
                err.response?.data?.message || "Üye ölçümleri alınamadı."
            );
        }
    }
);

// 3. GET MEMBER SESSIONS (PAGINATED)
export const fetchMemberSessions = createAsyncThunk(
    "gym/fetchMemberSessions",
    async (
        { memberPublicId, page = 1, limit = 10 }: { memberPublicId: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await API.get(
                `/gym/members/${memberPublicId}/sessions?page=${page}&limit=${limit}`
            );
            return {
                data: response.data.data.data,
                pagination: response.data.data.pagination,
            };
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(
                err.response?.data?.message || "Üye seansları alınamadı."
            );
        }
    }
);

// 4. GET MEMBER PROGRAMS (PAGINATED)
export const fetchMemberPrograms = createAsyncThunk(
    "gym/fetchMemberPrograms",
    async (
        { memberPublicId, page = 1, limit = 10 }: { memberPublicId: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await API.get(
                `/gym/members/${memberPublicId}/programs?page=${page}&limit=${limit}`
            );
            return {
                data: response.data.data.data,
                pagination: response.data.data.pagination,
            };
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(
                err.response?.data?.message || "Üye programları alınamadı."
            );
        }
    }
);

// GET TRAINER DETAIL
export const fetchTrainerDetail = createAsyncThunk(
    "gym/fetchTrainerDetail",
    async (trainerPublicId: string, { rejectWithValue }) => {
        try {
            const response = await API.get(
                `/gym/getTrainerDetail/${trainerPublicId}`
            );
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(
                err.response?.data?.message || "Antrenör detayı alınamadı."
            );
        }
    }
);

// APPROVE MEMBER ASSIGNMENT
export const approveMemberAssignment = createAsyncThunk(
    "gym/approveMemberAssignment",
    async (memberPublicId: string, { rejectWithValue }) => {
        try {
            const response = await API.post("/gym/approveAssignment", {
                memberPublicId,
            });

            return {
                memberPublicId,
                data: response.data.data,
            };
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(
                err.response?.data?.message || "Talep onaylanamadı."
            );
        }
    }
);

// REJECT MEMBER ASSIGNMENT
export const rejectMemberAssignment = createAsyncThunk(
    "gym/rejectMemberAssignment",
    async (memberPublicId: string, { rejectWithValue }) => {
        try {
            const response = await API.post("/gym/rejectAssignment", {
                memberPublicId,
            });

            return {
                memberPublicId,
                data: response.data.data,
            };
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(
                err.response?.data?.message || "Talep reddedilemedi."
            );
        }
    }
);

// GET MEMBERS BY ASSIGNMENT STATUS
export const fetchMembersByStatus = createAsyncThunk<
    FetchMembersByStatusPayload,
    MemberAssignmentStatus,
    { rejectValue: string }
>(
    "gym/fetchMembersByStatus",
    async (status, { rejectWithValue }) => {
        try {
            const response = await API.get(
                `/gym/getMembers?status=${status}`
            );

            return {
                data: response.data.data,
                status,
            };
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(
                err.response?.data?.message || "Üyeler alınamadı."
            );
        }
    }
);

const gymSlice = createSlice({
    name: "gym",
    initialState,
    reducers: {
        clearGymError: (state) => {
            state.error = null;
        },
        clearMemberDetail: (state) => {
            state.memberDetail = null;
            state.memberMeasurements = [];
            state.memberSessions = [];
            state.memberPrograms = [];
            state.memberDetailError = null;
            state.memberMeasurementsError = null;
            state.memberSessionsError = null;
            state.memberProgramsError = null;
        },
        clearTrainerDetail: (state) => {
            state.trainerDetail = null;
            state.trainerDetailError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGymProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGymProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchGymProfile.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string | undefined) ??
                    action.error.message ??
                    "Gym bilgileri alınamadı.";
            })

            .addCase(fetchAllMembers.pending, (state) => {
                state.membersLoading = true;
                state.membersError = null;
            })

            .addCase(fetchAllMembers.fulfilled, (state, action) => {
                state.membersLoading = false;

                const { data, pagination } = action.payload;

                state.members =
                    pagination.page > 1
                        ? [...state.members, ...data]
                        : data;

                state.pagination = pagination;
            })

            .addCase(fetchAllMembers.rejected, (state, action) => {
                state.membersLoading = false;
                state.membersError =
                    (action.payload as string | undefined) ??
                    action.error.message ??
                    "Üyeler alınamadı.";
            })

            .addCase(fetchAllTrainers.pending, (state) => {
                state.trainersLoading = true;
                state.trainersError = null;
            })
        .addCase(fetchAllTrainers.fulfilled, (state, action) => {
            state.trainersLoading = false;
            state.trainers = action.payload;
        })
        .addCase(fetchAllTrainers.rejected, (state, action) => {
            state.trainersLoading = false;
            state.trainersError =
                (action.payload as string | undefined) ??
                action.error.message ??
                "Antrenörler alınamadı.";
        })

        .addCase(removeMemberFromGym.pending, (state) => {
            state.membersLoading = true;
            state.membersError = null;
        })
        .addCase(removeMemberFromGym.fulfilled, (state, action) => {
            state.membersLoading = false;
            state.members = state.members.filter(
                (member) => member.publicId !== action.payload.publicId
            );

            if (state.pagination) {
                state.pagination.total = Math.max(
                    0,
                    state.pagination.total - 1
                );
            }
        })
        .addCase(removeMemberFromGym.rejected, (state, action) => {
            state.membersLoading = false;
            state.membersError =
                (action.payload as string | undefined) ??
                action.error.message ??
                "Üye silinemedi.";
        })

        .addCase(removeTrainerFromGym.pending, (state) => {
            state.trainersLoading = true;
            state.trainersError = null;
        })
        .addCase(removeTrainerFromGym.fulfilled, (state, action) => {
            state.trainersLoading = false;
            state.trainers = state.trainers.filter(
                (trainer) => trainer.publicId !== action.payload.publicId
            );
        })
        .addCase(removeTrainerFromGym.rejected, (state, action) => {
            state.trainersLoading = false;
            state.trainersError =
                (action.payload as string | undefined) ??
                action.error.message ??
                "Antrenör silinemedi.";
        })

        // 1. MEMBER PROFILE REDUCERS
        .addCase(fetchMemberProfile.pending, (state) => {
            state.memberDetailLoading = true;
            state.memberDetailError = null;
        })
        .addCase(fetchMemberProfile.fulfilled, (state, action) => {
            state.memberDetailLoading = false;
            state.memberDetail = action.payload;
        })
        .addCase(fetchMemberProfile.rejected, (state, action) => {
            state.memberDetailLoading = false;
            state.memberDetailError =
                (action.payload as string | undefined) ??
                action.error.message ??
                "Üye profili alınamadı.";
        })

        // 2. MEMBER MEASUREMENTS REDUCERS (PAGINATED)
        .addCase(fetchMemberMeasurements.pending, (state) => {
            state.memberMeasurementsLoading = true;
            state.memberMeasurementsError = null;
        })
        .addCase(fetchMemberMeasurements.fulfilled, (state, action) => {
            state.memberMeasurementsLoading = false;
            const { data, pagination } = action.payload;

            state.memberMeasurements =
                pagination.page > 1
                    ? [...state.memberMeasurements, ...data]
                    : data;

            state.memberMeasurementsPagination = pagination;
        })
        .addCase(fetchMemberMeasurements.rejected, (state, action) => {
            state.memberMeasurementsLoading = false;
            state.memberMeasurementsError =
                (action.payload as string | undefined) ??
                action.error.message ??
                "Üye ölçümleri alınamadı.";
        })

        // 3. MEMBER SESSIONS REDUCERS (PAGINATED)
        .addCase(fetchMemberSessions.pending, (state) => {
            state.memberSessionsLoading = true;
            state.memberSessionsError = null;
        })
        .addCase(fetchMemberSessions.fulfilled, (state, action) => {
            state.memberSessionsLoading = false;
            const { data, pagination } = action.payload;

            state.memberSessions =
                pagination.page > 1
                    ? [...state.memberSessions, ...data]
                    : data;

            state.memberSessionsPagination = pagination;
        })
        .addCase(fetchMemberSessions.rejected, (state, action) => {
            state.memberSessionsLoading = false;
            state.memberSessionsError =
                (action.payload as string | undefined) ??
                action.error.message ??
                "Üye seansları alınamadı.";
        })

        // 4. MEMBER PROGRAMS REDUCERS (PAGINATED)
        .addCase(fetchMemberPrograms.pending, (state) => {
            state.memberProgramsLoading = true;
            state.memberProgramsError = null;
        })
        .addCase(fetchMemberPrograms.fulfilled, (state, action) => {
            state.memberProgramsLoading = false;
            const { data, pagination } = action.payload;

            state.memberPrograms =
                pagination.page > 1
                    ? [...state.memberPrograms, ...data]
                    : data;

            state.memberProgramsPagination = pagination;
        })
        .addCase(fetchMemberPrograms.rejected, (state, action) => {
            state.memberProgramsLoading = false;
            state.memberProgramsError =
                (action.payload as string | undefined) ??
                action.error.message ??
                "Üye programları alınamadı.";
        })

        .addCase(fetchTrainerDetail.pending, (state) => {
            state.trainerDetailLoading = true;
            state.trainerDetailError = null;
        })
        .addCase(fetchTrainerDetail.fulfilled, (state, action) => {
            state.trainerDetailLoading = false;
            state.trainerDetail = action.payload;
        })
        .addCase(fetchTrainerDetail.rejected, (state, action) => {
            state.trainerDetailLoading = false;
            state.trainerDetailError =
                (action.payload as string | undefined) ??
                action.error.message ??
                "Antrenör detayı alınamadı.";
        })

        .addCase(approveMemberAssignment.pending, (state) => {
            state.assignmentLoading = true;
            state.assignmentError = null;
        })
        .addCase(approveMemberAssignment.fulfilled, (state, action) => {
            state.assignmentLoading = false;

            state.pendingMembers = state.pendingMembers.filter(
                (member) =>
                    member.publicId !== action.payload.memberPublicId
            );

            state.members = state.members.map((member) =>
                member.publicId === action.payload.memberPublicId
                    ? { ...member, assignmentStatus: "ASSIGNED" }
                    : member
            );
        })
        .addCase(approveMemberAssignment.rejected, (state, action) => {
            state.assignmentLoading = false;
            state.assignmentError =
                (action.payload as string | undefined) ??
                action.error.message ??
                "Talep onaylanamadı.";
        })

        .addCase(rejectMemberAssignment.pending, (state) => {
            state.assignmentLoading = true;
            state.assignmentError = null;
        })
        .addCase(rejectMemberAssignment.fulfilled, (state, action) => {
            state.assignmentLoading = false;

            state.pendingMembers = state.pendingMembers.filter(
                (member) =>
                    member.publicId !== action.payload.memberPublicId
            );

            state.members = state.members.map((member) =>
                member.publicId === action.payload.memberPublicId
                    ? {
                        ...member,
                        assignmentStatus: "UNASSIGNED",
                        trainerId: null,
                    }
                    : member
            );
        })
        .addCase(rejectMemberAssignment.rejected, (state, action) => {
            state.assignmentLoading = false;
            state.assignmentError =
                (action.payload as string | undefined) ??
                action.error.message ??
                "Talep reddedilemedi.";
        })

        .addCase(fetchMembersByStatus.pending, (state) => {
            state.statusMembersLoading = true;
            state.statusMembersError = null;
        })
        .addCase(fetchMembersByStatus.fulfilled, (state, action) => {
            state.statusMembersLoading = false;

            const { status, data } = action.payload;

            switch (status) {
                case "PENDING":
                    state.pendingMembers = data;
                    break;

                case "ASSIGNED":
                    state.assignedMembers = data;
                    break;

                case "UNASSIGNED":
                    state.unassignedMembers = data;
                    break;
            }
        })
        .addCase(fetchMembersByStatus.rejected, (state, action) => {
            state.statusMembersLoading = false;
            state.statusMembersError =
                action.payload ?? action.error.message ?? "Üyeler yüklenemedi.";
        });
},
});

export const {
    clearGymError,
    clearMemberDetail,
    clearTrainerDetail,
} = gymSlice.actions;

export default gymSlice.reducer;