import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { Member } from '@/types/types';

export type { Member };

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
            const response = await api.get(`/api/trainer/getMembers/${gymId}?status=${status}`);
            return { data: response.data, status };
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
            await api.post('/api/trainer/requestAssignment', { memberPublicId });
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
            await api.delete('/api/trainer/cancelAssignment', { data: { memberPublicId } });
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
            const response = await api.get(`/api/trainer/my-members/${memberPublicId}`);
            console.log(response.data.data)
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            console.log(err.response?.data.message)
            return rejectWithValue(err.response?.data?.message || 'Üye detayı alınamadı');
        }
    }
);

const trainerSlice = createSlice({
    name: 'trainer',
    initialState,
    reducers: {
        // Prevents stale member data flashing when navigating between detail pages
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
            });
    },
});

export const { clearSelectedMember } = trainerSlice.actions;
export default trainerSlice.reducer;