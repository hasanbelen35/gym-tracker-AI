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
    selectedMemberDetail: null,
    measurements: [],
    measurementsLoading: false,
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

export const fetchMemberDetail = createAsyncThunk(
    'trainer/fetchMemberDetail',
    async (memberPublicId: string, { rejectWithValue }) => {
        try {
            const response = await API.get(`/trainer/my-members/${memberPublicId}`);
            return response.data.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue, 'Üye detayı alınırken bir hata oluştu.');
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

export const fetchMemberMeasurements = createAsyncThunk(
    'trainer/fetchMemberMeasurements',
    async (memberPublicId: string, { rejectWithValue }) => {
        try {
            const response = await API.get(`/trainer/my-members/getMembersMeasurements/${memberPublicId}`);
            return response.data.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue, 'Ölçümler alınırken bir hata oluştu.');
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

const trainerSlice = createSlice({
    name: 'trainer',
    initialState,
    reducers: {
        clearSelectedMember: (state) => {
            state.selectedMemberDetail = null;
            state.measurements = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
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

            .addCase(fetchMemberDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMemberDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedMemberDetail = action.payload;
            })
            .addCase(fetchMemberDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

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

            .addCase(fetchMemberMeasurements.pending, (state) => {
                state.measurementsLoading = true;
                state.error = null;
            })
            .addCase(fetchMemberMeasurements.fulfilled, (state, action) => {
                state.measurementsLoading = false;
                state.measurements = action.payload || [];
            })
            .addCase(fetchMemberMeasurements.rejected, (state, action) => {
                state.measurementsLoading = false;
                state.error = action.payload as string;
            })

            .addCase(deleteMemberMeasurement.pending, (state) => {
                state.error = null;
            })
            .addCase(deleteMemberMeasurement.fulfilled, (state, action) => {
                state.measurements = state.measurements.filter(
                    (m: MemberMeasurement) => m.publicId !== action.payload
                );
            })
            .addCase(deleteMemberMeasurement.rejected, (state, action) => {
                state.error = action.payload as string;
            })

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