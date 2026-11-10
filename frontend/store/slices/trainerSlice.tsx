import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    Member,
    AddMeasurementArgs,
    DeleteMeasurementArgs,
    FetchMembersArgs,
    MemberMeasurement,
    CompleteTrainerProfileData,
} from '@/types/types';
import { UpdateTrainerProfileData } from '@/features/trainer/profile/types';
import { TrainerProfile, TrainerState } from '@/types/trainer.types';
import { API } from "@/lib/api";
import { handleApiError } from '../apiErrorHandler';

export type { Member };
export type { ApiErrorDetail, ApiErrorResponse } from '../apiErrorHandler';

const initialState: TrainerState = {
    pendingMembers: [],
    approvedMembers: [],
    availableMembers: [],

    selectedMemberProfile: null,

    measurements: [],
    measurementsPagination: null,
    measurementsLoading: false,

    sessions: [],
    sessionsPagination: null,
    sessionsLoading: false,

    programs: [],
    programsPagination: null,
    programsLoading: false,

    workoutLogs: [],
    workoutLogsPagination: null,
    workoutLogsLoading: false,

    loading: false,
    error: null,

    trainerProfile: {
        id: 0,
        name: '',
        surname: '',
        email: '',
        createdAt: '',
        gym: {
            name: '',
        },
    },
};

export const fetchTrainerProfile = createAsyncThunk<
    TrainerProfile,
    void,
    { rejectValue: string }
>(
    'trainer/fetchTrainerProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/trainer/profile');
            return response.data.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue, 'Profil bilgileri alınırken bir hata oluştu.');
        }
    }
);

export const fetchMembersByStatus = createAsyncThunk(
    'trainer/fetchMembers',
    async ({ gymId, status }: FetchMembersArgs, { rejectWithValue }) => {
        try {
            const response = await API.get(`/trainer/getMembers/${gymId}?status=${status}`);
            return { data: response.data.data, status };
        } catch (error) {
            return handleApiError(error, rejectWithValue, 'Üyeler alınırken bir hata oluştu.');
        }
    }
);

export const requestAssignment = createAsyncThunk(
    'trainer/requestAssignment',
    async (memberPublicId: string, { rejectWithValue }) => {
        try {
            await API.post('/trainer/requestAssignment', { memberPublicId });
            return memberPublicId;
        } catch (error) {
            return handleApiError(error, rejectWithValue, 'Atama talebi gönderilirken bir hata oluştu.');
        }
    }
);

export const cancelAssignment = createAsyncThunk(
    'trainer/cancelAssignment',
    async (memberPublicId: string, { rejectWithValue }) => {
        try {
            await API.delete('/trainer/cancelAssignment', { data: { memberPublicId } });
            return memberPublicId;
        } catch (error) {
            return handleApiError(error, rejectWithValue, 'Atama talebi iptal edilirken bir hata oluştu.');
        }
    }
);

// GET MEMBER'S PROFILE DATA
export const fetchMemberProfileByTrainer = createAsyncThunk(
    'trainer/fetchMemberProfile',
    async (memberPublicId: string, { rejectWithValue }) => {
        try {
            const response = await API.get(`/trainer/my-members/${memberPublicId}/profile`);
            return response.data.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue, 'Üye profili alınırken bir hata oluştu.');
        }
    }
);

// GET MEMBER'S MEASUREMENT PAGINATED DATA
export const fetchMemberMeasurementsByTrainer = createAsyncThunk(
    'trainer/fetchMemberMeasurementsByTrainer',
    async ({ memberPublicId, page = 1, limit = 10 }: { memberPublicId: string; page?: number; limit?: number }, { rejectWithValue }) => {
        try {
            const response = await API.get(`/trainer/my-members/${memberPublicId}/measurements?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue, 'Üye ölçümleri alınırken bir hata oluştu.');
        }
    }
);

// GET MEMBER'S SESSIONS PAGINATED DATA
export const fetchMemberSessionsByTrainer = createAsyncThunk(
    'trainer/fetchMemberSessions',
    async ({ memberPublicId, page = 1, limit = 10 }: { memberPublicId: string; page?: number; limit?: number }, { rejectWithValue }) => {
        try {
            const response = await API.get(`/trainer/my-members/${memberPublicId}/sessions?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue, 'Üye seansları alınırken bir hata oluştu.');
        }
    }
);

// GET MEMBER'S PROGRAMS PAGINATED DATA
export const fetchMemberProgramsByTrainer = createAsyncThunk(
    'trainer/fetchMemberPrograms',
    async ({ memberPublicId, page = 1, limit = 10 }: { memberPublicId: string; page?: number; limit?: number }, { rejectWithValue }) => {
        try {
            const response = await API.get(`/trainer/my-members/${memberPublicId}/programs?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue, 'Üye programları alınırken bir hata oluştu.');
        }
    }
);

// GET MEMBER'S WORKOUT LOGS PAGINATED DATA
export const fetchAssignedMemberWorkoutLogs = createAsyncThunk(
    'trainer/fetchAssignedMemberWorkoutLogs',
    async ({ memberPublicId, page = 1, limit = 10 }: { memberPublicId: string; page?: number; limit?: number }, { rejectWithValue }) => {
        try {
            const response = await API.get(`/trainer/my-members/${memberPublicId}/workout-logs?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue, 'Üyenin antrenman geçmişi alınırken bir hata oluştu.');
        }
    }
);

export const addMemberMeasurement = createAsyncThunk(
    'trainer/addMemberMeasurement',
    async ({ memberPublicId, measurementData }: AddMeasurementArgs, { rejectWithValue }) => {
        try {
            const response = await API.post(`/trainer/my-members/addMeasurement/${memberPublicId}`, measurementData);
            return response.data.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue, 'Ölçüm eklenirken bir hata oluştu.');
        }
    }
);

export const deleteMemberMeasurement = createAsyncThunk(
    'trainer/deleteMemberMeasurement',
    async ({ memberPublicId, measurementPublicId }: DeleteMeasurementArgs, { rejectWithValue }) => {
        try {
            await API.delete(`/trainer/my-members/deleteMemberMeasurement/${memberPublicId}/${measurementPublicId}`);
            return measurementPublicId;
        } catch (error) {
            return handleApiError(error, rejectWithValue, 'Ölçüm silinirken bir hata oluştu.');
        }
    }
);

export const completeTrainerProfile = createAsyncThunk(
    'trainer/completeTrainerProfile',
    async (profileData: CompleteTrainerProfileData, { rejectWithValue }) => {
        try {
            const response = await API.put('/trainer/complete-profile', profileData);
            return response.data.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue, 'Profil tamamlanırken bir hata oluştu.');
        }
    }
);

export const updateTrainerProfile = createAsyncThunk(
    'trainer/updateTrainerProfile',
    async (profileData: UpdateTrainerProfileData, { rejectWithValue }) => {
        try {
            const response = await API.put('/trainer/update-profile', profileData);
            return response.data.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue, 'Profil güncellenirken bir hata oluştu.');
        }
    }
);

export const activateMemberProgram = createAsyncThunk(
    'trainer/activateMemberProgram',
    async (programPublicId: string, { rejectWithValue }) => {
        try {
            const response = await API.put(`/trainer/programs/${programPublicId}/activate`);
            return response.data.data;
        } catch (error) {
            console.log(error);
            return handleApiError(error, rejectWithValue, 'Program aktifleştirilirken bir hata oluştu.');
        }
    }
);

const trainerSlice = createSlice({
    name: 'trainer',
    initialState,
    reducers: {
        clearSelectedMember: (state) => {
            state.selectedMemberProfile = null;
            state.measurements = [];
            state.measurementsPagination = null;
            state.sessions = [];
            state.sessionsPagination = null;
            state.programs = [];
            state.programsPagination = null;
            state.workoutLogs = [];
            state.workoutLogsPagination = null;
            state.workoutLogsLoading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // 1. Trainer Profile
            .addCase(fetchTrainerProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTrainerProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.trainerProfile = action.payload;
            })
            .addCase(fetchTrainerProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // 2. Members By Status
            .addCase(fetchMembersByStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMembersByStatus.fulfilled, (state, action) => {
                state.loading = false;
                const { data, status } = action.payload;

                if (status === 'UNASSIGNED') {
                    state.availableMembers = data || [];
                } else if (status === 'PENDING') {
                    state.pendingMembers = data || [];
                } else if (status === 'ASSIGNED') {
                    state.approvedMembers = data || [];
                }
            })
            .addCase(fetchMembersByStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // 3. Request Assignment
            .addCase(requestAssignment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(requestAssignment.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(requestAssignment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // 4. Cancel Assignment
            .addCase(cancelAssignment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelAssignment.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(cancelAssignment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // 5. Member Profile By Trainer
            .addCase(fetchMemberProfileByTrainer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMemberProfileByTrainer.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedMemberProfile = action.payload;
            })
            .addCase(fetchMemberProfileByTrainer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // 6. Measurements By Trainer (Paginated / Infinite Scroll)
            .addCase(fetchMemberMeasurementsByTrainer.pending, (state) => {
                state.measurementsLoading = true;
            })
            .addCase(fetchMemberMeasurementsByTrainer.fulfilled, (state, action) => {
                state.measurementsLoading = false;
                if ((action.meta.arg.page ?? 1) === 1) {
                    state.measurements = action.payload.data;
                } else {
                    state.measurements = [...state.measurements, ...action.payload.data];
                }
                state.measurementsPagination = action.payload.pagination;
            })
            .addCase(fetchMemberMeasurementsByTrainer.rejected, (state, action) => {
                state.measurementsLoading = false;
                state.error = action.payload as string;
            })

            // 7. Sessions By Trainer (Paginated / Infinite Scroll)
            .addCase(fetchMemberSessionsByTrainer.pending, (state) => {
                state.sessionsLoading = true;
            })
            .addCase(fetchMemberSessionsByTrainer.fulfilled, (state, action) => {
                state.sessionsLoading = false;
                if ((action.meta.arg.page ?? 1) === 1) {
                    state.sessions = action.payload.data;
                } else {
                    state.sessions = [...state.sessions, ...action.payload.data];
                }
                state.sessionsPagination = action.payload.pagination;
            })
            .addCase(fetchMemberSessionsByTrainer.rejected, (state, action) => {
                state.sessionsLoading = false;
                state.error = action.payload as string;
            })

            // 8. Programs By Trainer (Paginated / Infinite Scroll)
            .addCase(fetchMemberProgramsByTrainer.pending, (state) => {
                state.programsLoading = true;
            })
            .addCase(fetchMemberProgramsByTrainer.fulfilled, (state, action) => {
                state.programsLoading = false;
                if ((action.meta.arg.page ?? 1) === 1) {
                    state.programs = action.payload.data;
                } else {
                    state.programs = [...state.programs, ...action.payload.data];
                }
                state.programsPagination = action.payload.pagination;
            })
            .addCase(fetchMemberProgramsByTrainer.rejected, (state, action) => {
                state.programsLoading = false;
                state.error = action.payload as string;
            })

            // 9. Workout Logs By Trainer (Paginated / Infinite Scroll)
            .addCase(fetchAssignedMemberWorkoutLogs.pending, (state) => {
                state.workoutLogsLoading = true;
            })
            .addCase(fetchAssignedMemberWorkoutLogs.fulfilled, (state, action) => {
                state.workoutLogsLoading = false;
                if ((action.meta.arg.page ?? 1) === 1) {
                    state.workoutLogs = action.payload.data;
                } else {
                    state.workoutLogs = [...state.workoutLogs, ...action.payload.data];
                }
                state.workoutLogsPagination = action.payload.pagination;
            })
            .addCase(fetchAssignedMemberWorkoutLogs.rejected, (state, action) => {
                state.workoutLogsLoading = false;
                state.error = action.payload as string;
            })

            // 10. Add Member Measurement
            .addCase(addMemberMeasurement.pending, (state) => {
                state.error = null;
            })
            .addCase(addMemberMeasurement.fulfilled, (state, action) => {
                if (action.payload) {
                    state.measurements.unshift(action.payload);
                }
            })
            .addCase(addMemberMeasurement.rejected, (state, action) => {
                state.error = action.payload as string;
            })

            // 11. Delete Member Measurement
            .addCase(deleteMemberMeasurement.pending, (state) => {
                state.error = null;
            })
            .addCase(deleteMemberMeasurement.fulfilled, (state, action) => {
                state.measurements = state.measurements.filter(
                    (m: MemberMeasurement) => m.publicId !== action.payload
                );
                if (state.measurementsPagination) {
                    state.measurementsPagination.total = Math.max(0, state.measurementsPagination.total - 1);
                }
            })
            .addCase(deleteMemberMeasurement.rejected, (state, action) => {
                state.error = action.payload as string;
            })

            // 12. Complete Trainer Profile
            .addCase(completeTrainerProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(completeTrainerProfile.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(completeTrainerProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // 13. Update Trainer Profile
            .addCase(updateTrainerProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTrainerProfile.fulfilled, (state, action) => {
                state.loading = false;

                if (state.trainerProfile) {
                    state.trainerProfile = { ...state.trainerProfile, ...action.payload };
                } else {
                    state.trainerProfile = action.payload;
                }
            })
            .addCase(updateTrainerProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearSelectedMember } = trainerSlice.actions;
export default trainerSlice.reducer;