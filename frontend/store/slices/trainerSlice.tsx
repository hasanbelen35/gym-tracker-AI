import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { Member, CreateMeasurementPayload } from '@/types/types';
import { API } from "@/lib/api";

export type { Member };

interface ApiErrorResponse {
    message?: string;
}

interface TrainerState {
    pendingMembers: Member[];
    approvedMembers: Member[];
    availableMembers: Member[];
    selectedMemberDetail: Member | null;
    loading: boolean;
    error: string | null;
}

const initialState: TrainerState = {
    pendingMembers: [],
    approvedMembers: [],
    availableMembers: [],
    selectedMemberDetail: null,
    loading: false,
    error: null,
};

interface FetchMembersArgs {
    gymId: string;
    status: 'PENDING' | 'ASSIGNED' | 'UNASSIGNED';
}

export const fetchMembersByStatus = createAsyncThunk(
    'trainer/fetchMembers',
    async ({ gymId, status }: FetchMembersArgs, { rejectWithValue }) => {
        try {
            const response = await API.get(`/trainer/getMembers/${gymId}?status=${status}`);
            return { data: response.data.data, status };
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(err.response?.data?.message || 'Üyeler getirilirken bir hata oluştu');
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
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(err.response?.data?.message || 'Talep gönderilemedi');
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
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(err.response?.data?.message || 'Talep iptal edilemedi');
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
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(err.response?.data?.message || 'Üye detayı alınamadı');
        }
    }
);

interface AddMeasurementArgs {
    memberPublicId: string;
    measurementData: CreateMeasurementPayload;
}

export const addMemberMeasurement = createAsyncThunk(
    'trainer/addMemberMeasurement',
    async ({ memberPublicId, measurementData }: AddMeasurementArgs, { rejectWithValue }) => {
        try {
            const response = await API.post(`/trainer/my-members/addMeasurement/${memberPublicId}`, measurementData);
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(err.response?.data?.message || 'Ölçüm eklenemedi');
        }
    }
);

export const fetchMemberMeasurements = createAsyncThunk(
    'trainer/fetchMemberMeasurements',
    async (memberPublicId: string, { rejectWithValue }) => {
        try {
            const response = await API.get(`/trainer/my-members/getMembersMeasurements/${memberPublicId}`);
            console.log("basarılı cekmek")

            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            console.log("hata verıyor cekmek")
            return rejectWithValue(err.response?.data?.message || 'Ölçüm geçmişi alınamadı');
        }
    }
);

const trainerSlice = createSlice({
    name: 'trainer',
    initialState,
    reducers: {
        clearSelectedMember: (state) => {
            state.selectedMemberDetail = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
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
                state.loading = true;
                state.error = null;
            })
            .addCase(addMemberMeasurement.fulfilled, (state, action) => {
                state.loading = false;
                if (state.selectedMemberDetail && action.payload) {
                    if (!state.selectedMemberDetail.measurements) {
                        state.selectedMemberDetail.measurements = [];
                    }
                    state.selectedMemberDetail.measurements.unshift(action.payload);
                }
            })
            .addCase(addMemberMeasurement.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchMemberMeasurements.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMemberMeasurements.fulfilled, (state, action) => {
                state.loading = false;
                if (state.selectedMemberDetail) {
                    state.selectedMemberDetail.measurements = action.payload;
                }
            })
            .addCase(fetchMemberMeasurements.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearSelectedMember } = trainerSlice.actions;
export default trainerSlice.reducer;