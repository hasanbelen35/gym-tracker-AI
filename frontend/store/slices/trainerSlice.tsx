import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Member } from '@/types/types';
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
  async ({ gymId, status }: { gymId: string; status: 'PENDING' | 'ASSIGNED' | 'UNASSIGNED' }) => {
    const response = await api.get(`/api/trainer/getMembers/${gymId}?status=${status}`);
    return { data: response.data, status };
  }
);

// SEND REQUEST ASSIGNMENT
export const requestAssignment = createAsyncThunk(
  'trainer/requestAssignment',
  async ({ memberPublicId, gymId }: { memberPublicId: string; gymId: string }) => {
    await api.post('/api/trainer/requestAssignment', { memberPublicId, gymId });
    return memberPublicId;
  }
);

// DRAW BACK REQUEST ASSIGNMENT
export const cancelAssignment = createAsyncThunk(
  'trainer/cancelAssignment',
  async ({ memberPublicId, gymId }: { memberPublicId: string; gymId: string }) => {
    await api.delete('/api/trainer/cancelAssignment', { data: { memberPublicId, gymId } });
    return memberPublicId;
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
        if (action.payload.status === 'UNASSIGNED') {
          state.availableMembers = action.payload.data;
        } else if (action.payload.status === 'PENDING') {
          state.pendingMembers = action.payload.data;
        } else {
          state.approvedMembers = action.payload.data;
        }
      })
      .addCase(fetchMembersByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Üyeler getirilirken bir hata oluştu';
      })

      // REQUEST ASSIGNMENT
      .addCase(requestAssignment.pending, (state) => {
        state.loading = true;
      })
      .addCase(requestAssignment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(requestAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Talep gönderilemedi';
      })

      // CANCEL ASSIGNMENT
      .addCase(cancelAssignment.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingMembers = state.pendingMembers.filter(m => m.publicId !== action.payload);
      })
      .addCase(cancelAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Talep iptal edilemedi';
      });
  },
});

export default trainerSlice.reducer;