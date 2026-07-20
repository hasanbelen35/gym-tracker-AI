import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { Member } from '@/types/types';

interface ApiErrorResponse {
    message?: string;
}

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
    withCredentials: true,
});

interface TrainerState {
    pendingMembers: Member[];
    approvedMembers: Member[];
    availableMembers: Member[];
    loading: boolean;
    error: string | null;
}

const initialState: TrainerState = {
    pendingMembers: [],
    approvedMembers: [],
    availableMembers: [],
    loading: false,
    error: null,
};

// FETCH MEMBERS BY STATUS 
export const fetchMembersByStatus = createAsyncThunk(
    'trainer/fetchMembers',
    async ({ gymId, status }: { gymId: string; status: 'PENDING' | 'ASSIGNED' | 'UNASSIGNED' }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/trainer/getMembers/${gymId}?status=${status}`);
            return { data: response.data, status };
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(err.response?.data?.message || 'Üyeler getirilirken bir hata oluştu');
        }
    }
);

// SEND REQUEST ASSIGNMENT
export const requestAssignment = createAsyncThunk(
    'trainer/requestAssignment',
    async ({ memberPublicId, gymId }: { memberPublicId: string; gymId: string }, { rejectWithValue }) => {
        try {
            await api.post('/api/trainer/requestAssignment', { memberPublicId, gymId });
            return memberPublicId;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(err.response?.data?.message || 'Talep gönderilemedi');
        }
    }
);

// DRAW BACK REQUEST ASSIGNMENT
export const cancelAssignment = createAsyncThunk(
    'trainer/cancelAssignment',
    async ({ memberPublicId, gymId }: { memberPublicId: string; gymId: string }, { rejectWithValue }) => {
        try {
            await api.delete('/api/trainer/cancelAssignment', { data: { memberPublicId, gymId } });
            return memberPublicId;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(err.response?.data?.message || 'Talep iptal edilemedi');
        }
    }
);

const trainerSlice = createSlice({
    name: 'trainer',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // FETCH MEMBERS
            .addCase(fetchMembersByStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMembersByStatus.fulfilled, (state, action) => {
                state.loading = false;
                const { data, status } = action.payload;

                if (status === 'UNASSIGNED') {
                    state.availableMembers = data;
                } else if (status === 'PENDING') {
                    state.pendingMembers = data;
                } else if (status === 'ASSIGNED') {
                    state.approvedMembers = data;
                }
            })
            .addCase(fetchMembersByStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // REQUEST ASSIGNMENT
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

            // CANCEL ASSIGNMENT
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
            });
    },
});

export default trainerSlice.reducer;