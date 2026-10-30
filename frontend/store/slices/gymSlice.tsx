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

    memberDetail: null,
    memberDetailLoading: false,
    memberDetailError: null,

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

// GET MEMBER DETAIL
export const fetchMemberDetail = createAsyncThunk(
    "gym/fetchMemberDetail",
    async (memberPublicId: string, { rejectWithValue }) => {
        try {
            const response = await API.get(
                `/gym/getMemberDetail/${memberPublicId}`
            );
            console.log(response.data.data)
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(
                err.response?.data?.message || "Üye detayı alınamadı."
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
            state.memberDetailError = null;
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

        .addCase(fetchMemberDetail.pending, (state) => {
            state.memberDetailLoading = true;
            state.memberDetailError = null;
        })
        .addCase(fetchMemberDetail.fulfilled, (state, action) => {
            state.memberDetailLoading = false;
            state.memberDetail = action.payload;
        })
        .addCase(fetchMemberDetail.rejected, (state, action) => {
            state.memberDetailLoading = false;
            state.memberDetailError =
                (action.payload as string | undefined) ??
                action.error.message ??
                "Üye detayı alınamadı.";
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
