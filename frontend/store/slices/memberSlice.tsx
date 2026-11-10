import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { DetailedProgram, MemberState } from "@/features/member/get-my-programs/types";
import { API } from "@/lib/api";
import { handleApiError } from "../apiErrorHandler";
import { UpdateMemberProfileData } from "@/features/member/profile/types";

interface CompleteProfilePayload {
    age?: number;
    height?: number;
    weight?: number;
    gender?: "MALE" | "FEMALE";
    medicalNotes?: string;
    avatarUrl?: string;
    goal?: "MUSCLE_GAIN" | "FAT_LOSS" | "STRENGTH" | "GENERAL_FITNESS";
    experienceLevel?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    workoutDaysPerWeek?: number;
    sessionDuration?: number;
    equipmentAccess?: "GYM" | "HOME" | "BODYWEIGHT";
    activityLevel?: "SEDENTARY" | "MODERATE" | "ACTIVE";
    additionalNotes?: string;
}

interface MemberSession {
    id: number;
    publicId: string;
    checkIn: string;
    checkOut: string | null;
    duration: number | null;
}

interface MemberMeasurement {
    id: number;
    publicId: string;
    bodyFatRate: number | null;
    muscleMass: number | null;
    chest: number | null;
    waist: number | null;
    arm: number | null;
    hip: number | null;
    shoulder: number | null;
    notes: string | null;
    measuredAt: string;
    createdAt: string;
}

export interface ExtendedMemberState extends MemberState {
    sessions: MemberSession[];
    sessionsPagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    measurements: MemberMeasurement[];
    measurementsPagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

const initialState: ExtendedMemberState = {
    trainer: null,
    assignmentStatus: null,
    profile: null,
    programs: [],
    sessions: [],
    sessionsPagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
    },
    measurements: [],
    measurementsPagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
    },
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

// ==========================================
// ASYNC THUNKS
// ==========================================

export const fetchCurrentMember = createAsyncThunk(
    "member/fetchCurrentMember",
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get("/member/me");
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            return rejectWithValue(err.response?.data?.message || "Profil verileri alınamadı.");
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
            return rejectWithValue(err.response?.data?.message || "Antrenör verisi alınamadı.");
        }
    }
);

export const fetchMemberPrograms = createAsyncThunk(
    "member/fetchMemberPrograms",
    async (params: { onlyActive?: boolean; page?: number; limit?: number } = {}, { rejectWithValue }) => {
        try {
            const response = await API.get("/member/my-programs", {
                params,
            });

            console.log(response.data.data)
            return {
                data: response.data.data,
                pagination: response.data.pagination,
                params,
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

export const fetchMemberSessions = createAsyncThunk(
    "member/fetchMemberSessions",
    async (params: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
        try {
            const response = await API.get("/member/sessions", {
                params,
            });
            return {
                data: response.data.data,
                pagination: response.data.pagination,
                params,
            };
        } catch (error) {
            return handleApiError(
                error,
                rejectWithValue,
                "Salon giriş kayıtları yüklenirken bir hata oluştu."
            );
        }
    }
);

export const fetchMemberMeasurements = createAsyncThunk(
    "member/fetchMemberMeasurements",
    async (params: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
        try {
            const response = await API.get("/member/measurements", {
                params,
            });
            return {
                data: response.data.data,
                pagination: response.data.pagination,
                params,
            };
        } catch (error) {
            return handleApiError(
                error,
                rejectWithValue,
                "Fiziksel ölçüm verileri yüklenirken bir hata oluştu."
            );
        }
    }
);

export const completeMemberProfile = createAsyncThunk(
    "member/completeProfile",
    async (data: CompleteProfilePayload, { rejectWithValue }) => {
        try {
            const response = await API.put("/member/profile/complete", data);
            return response.data.data;
        } catch (error) {
            return handleApiError(
                error,
                rejectWithValue,
                "Profil tamamlanırken bir hata oluştu."
            );
        }
    }
);

export const updateMemberProfile = createAsyncThunk(
    "member/updateProfile",
    async (data: UpdateMemberProfileData, { rejectWithValue }) => {
        try {
            const response = await API.put("/member/edit-profile", data);
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

// ==========================================
// SLICE DEFINITION
// ==========================================

const memberSlice = createSlice({
    name: "member",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // FETCH CURRENT MEMBER CORE
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

            // FETCH MY TRAINER
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

            // FETCH MEMBER PROGRAMS (PAGINATED)
            .addCase(fetchMemberPrograms.fulfilled, (state, action) => {
                state.loading = false;
                const { data, pagination, params } = action.payload;

                if (params?.onlyActive) {
                    const archivedOnly = state.programs.filter((p) => !p.isActive);
                    const combined = [...data, ...archivedOnly];

                    const uniqueProgramsMap = new Map();
                    combined.forEach((prog) => {
                        const key = prog.id ?? prog.publicId;
                        if (key) uniqueProgramsMap.set(key, prog);
                    });

                    state.programs = Array.from(uniqueProgramsMap.values());
                } else {
                    const currentPage = params?.page || 1;

                    if (currentPage === 1) {
                        const combined = [...state.programs.filter((p) => p.isActive), ...data];
                        const uniqueProgramsMap = new Map();
                        combined.forEach((prog) => {
                            const key = prog.id ?? prog.publicId;
                            if (key) uniqueProgramsMap.set(key, prog);
                        });
                        state.programs = Array.from(uniqueProgramsMap.values());
                    } else {
                        const existingKeys = new Set(
                            state.programs.map((p) => String(p.id ?? p.publicId))
                        );
                        const newItems = data.filter(
                            (p: DetailedProgram) => !existingKeys.has(String(p.id ?? p.publicId))
                        );
                        state.programs = [...state.programs, ...newItems];
                    }

                    state.pagination = pagination;
                }
            })
            // FETCH MEMBER SESSIONS (PAGINATED)
            .addCase(fetchMemberSessions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMemberSessions.fulfilled, (state, action) => {
                state.loading = false;
                const { data, pagination, params } = action.payload;
                const currentPage = params?.page || 1;

                if (currentPage === 1) {
                    state.sessions = data;
                } else {
                    const existingIds = new Set(state.sessions.map((s) => s.id));
                    const newItems = data.filter((s: MemberSession) => !existingIds.has(s.id));
                    state.sessions = [...state.sessions, ...newItems];
                }
                state.sessionsPagination = pagination;
            })
            .addCase(fetchMemberSessions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // FETCH MEMBER MEASUREMENTS (PAGINATED)
            .addCase(fetchMemberMeasurements.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMemberMeasurements.fulfilled, (state, action) => {
                state.loading = false;
                const { data, pagination, params } = action.payload;
                const currentPage = params?.page || 1;

                if (currentPage === 1) {
                    state.measurements = data;
                } else {
                    const existingIds = new Set(state.measurements.map((m) => m.id));
                    const newItems = data.filter((m: MemberMeasurement) => !existingIds.has(m.id));
                    state.measurements = [...state.measurements, ...newItems];
                }
                state.measurementsPagination = pagination;
            })
            .addCase(fetchMemberMeasurements.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // COMPLETE MEMBER PROFILE
            .addCase(completeMemberProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(completeMemberProfile.fulfilled, (state, action) => {
                state.loading = false;
                if (state.profile) {
                    state.profile = { ...state.profile, ...action.payload };
                } else {
                    state.profile = action.payload;
                }
            })
            .addCase(completeMemberProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // UPDATE MEMBER PROFILE
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