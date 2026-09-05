import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { Member, AddMeasurementArgs, DeleteMeasurementArgs, FetchMembersArgs, MemberMeasurement } from '@/types/types';
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
    measurements: MemberMeasurement[];
    measurementsLoading: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: TrainerState = {
    pendingMembers: [],
    approvedMembers: [],
    availableMembers: [],
    selectedMemberDetail: null,
    measurements: [],
    measurementsLoading: false,
    loading: false,
    error: null,
};

// FETCH MEMBERS BY ASSIGNMENT STATUS
export const fetchMembersByStatus = createAsyncThunk(
    'trainer/fetchMembers',
    async ({ gymId, status }: FetchMembersArgs, { rejectWithValue }) => {
        try {
            const response = await API.get(`/trainer/getMembers/${gymId}?status=${status}`);
            return { data: response.data.data, status };
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(err.response?.data?.message);
        }
    }
);
// SEND REQUEST TO GYM FOT ASSIGN MEMBER TO ON TRAINER
export const requestAssignment = createAsyncThunk(
    'trainer/requestAssignment',
    async (memberPublicId: string, { rejectWithValue }) => {
        try {
            await API.post('/trainer/requestAssignment', { memberPublicId });
            return memberPublicId;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(err.response?.data?.message);
        }
    }
);
// CANCEL ASSIGNMENT REQUEST FROM GYM
export const cancelAssignment = createAsyncThunk(
    'trainer/cancelAssignment',
    async (memberPublicId: string, { rejectWithValue }) => {
        try {
            await API.delete('/trainer/cancelAssignment', { data: { memberPublicId } });
            return memberPublicId;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(err.response?.data?.message);
        }
    }
);
// FETCH MEMBER'S DETAILED  DATA
export const fetchMemberDetail = createAsyncThunk(
    'trainer/fetchMemberDetail',
    async (memberPublicId: string, { rejectWithValue }) => {
        try {
            const response = await API.get(`/trainer/my-members/${memberPublicId}`);
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(err.response?.data?.message);
        }
    }
);


// ADD MEASUREMENTS TO MEMBER
export const addMemberMeasurement = createAsyncThunk(
    'trainer/addMemberMeasurement',
    async ({ memberPublicId, measurementData }: AddMeasurementArgs, { rejectWithValue }) => {
        try {
            const response = await API.post(`/trainer/my-members/addMeasurement/${memberPublicId}`, measurementData);
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(err.response?.data?.message);
        }
    }
);
// FETCH ALL MEASUREMENTS FROM MEMBER
export const fetchMemberMeasurements = createAsyncThunk(
    'trainer/fetchMemberMeasurements',
    async (memberPublicId: string, { rejectWithValue }) => {
        try {
            const response = await API.get(`/trainer/my-members/getMembersMeasurements/${memberPublicId}`);
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

// DELETE MEASUREMENTS FROM MEMBER
export const deleteMemberMeasurement = createAsyncThunk(
    'trainer/deleteMemberMeasurement',
    async ({ memberPublicId, measurementPublicId }: DeleteMeasurementArgs, { rejectWithValue }) => {
        try {
            await API.delete(`/trainer/my-members/deleteMemberMeasurement/${memberPublicId}/${measurementPublicId}`);
            return measurementPublicId;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(err.response?.data?.message);
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
    },
});

export const { clearSelectedMember } = trainerSlice.actions;
export default trainerSlice.reducer;