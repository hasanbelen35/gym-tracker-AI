// src/store/slices/gymSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = axios.create({
    baseURL: process.env.SERVER_API_URL || "http://localhost:5000/api",
    withCredentials: true,
});

interface GymState {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    profile: any | null;
    loading: boolean;
    error: string | null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    members: any[];
    membersLoading: boolean;
    membersError: string | null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trainers: any[];
    trainersLoading: boolean;
    trainersError: string | null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    memberDetail: any | null;
    memberDetailLoading: boolean;
    memberDetailError: string | null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trainerDetail: any | null;
    trainerDetailLoading: boolean;
    trainerDetailError: string | null;
}

const initialState: GymState = {
    profile: null,
    loading: false,
    error: null,

    members: [],
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
};

// GET GYM PROFILE DATAS
export const fetchGymProfile = createAsyncThunk(
    'gym/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/gym/getAllGym');
            return response.data.data;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Gym bilgileri alınamadı.");
        }
    }
);

// GET ALL MEMBERS
export const fetchAllMembers = createAsyncThunk(
    'gym/fetchAllMembers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/gym/getAllMembers');
            return response.data.data;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Üyeler alınamadı.");
        }
    }
);

// GET ALL TRAINERS 
export const fetchAllTrainers = createAsyncThunk(
    'gym/fetchAllTrainers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/gym/getAllTrainers');
            return response.data.data;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Antrenörler alınamadı.");
        }
    }
);

// REMOVE MEMBER FROM GYM
export const removeMemberFromGym = createAsyncThunk(
    'gym/removeMemberFromGym',
    async (memberPublicId: string, { rejectWithValue }) => {
        try {
            const response = await API.delete(`/gym/deleteMemberFromGym/${memberPublicId}`);
            return response.data.data;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Üye silinemedi.");
        }
    }
);

// REMOVE TRAINER FROM GYM
export const removeTrainerFromGym = createAsyncThunk(
    'gym/removeTrainerFromGym',
    async (trainerPublicId: string, { rejectWithValue }) => {
        try {
            const response = await API.delete(`/gym/deleteTrainerFromGym/${trainerPublicId}`);
            return response.data.data;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Antrenör silinemedi.");
        }
    }
);

// GET MEMBER DETAIL
export const fetchMemberDetail = createAsyncThunk(
    'gym/fetchMemberDetail',
    async (memberPublicId: string, { rejectWithValue }) => {
        try {
            const response = await API.get(`/gym/getMemberDetail/${memberPublicId}`);
            return response.data.data;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Üye detayı alınamadı.");
        }
    }
);

// GET TRAINER DETAIL
export const fetchTrainerDetail = createAsyncThunk(
    'gym/fetchTrainerDetail',
    async (trainerPublicId: string, { rejectWithValue }) => {
        try {
            const response = await API.get(`/gym/getTrainerDetail/${trainerPublicId}`);
            return response.data.data;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Antrenör detayı alınamadı.");
        }
    }
);

const gymSlice = createSlice({
    name: 'gym',
    initialState,
    reducers: {
        clearGymError: (state) => { state.error = null; },
        clearMemberDetail: (state) => { state.memberDetail = null; state.memberDetailError = null; },
        clearTrainerDetail: (state) => { state.trainerDetail = null; state.trainerDetailError = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGymProfile.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchGymProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchGymProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchAllMembers.pending, (state) => { state.membersLoading = true; state.membersError = null; })
            .addCase(fetchAllMembers.fulfilled, (state, action) => {
                state.membersLoading = false;
                state.members = action.payload;
            })
            .addCase(fetchAllMembers.rejected, (state, action) => {
                state.membersLoading = false;
                state.membersError = action.payload as string;
            })

            .addCase(fetchAllTrainers.pending, (state) => { state.trainersLoading = true; state.trainersError = null; })
            .addCase(fetchAllTrainers.fulfilled, (state, action) => {
                state.trainersLoading = false;
                state.trainers = action.payload;
            })
            .addCase(fetchAllTrainers.rejected, (state, action) => {
                state.trainersLoading = false;
                state.trainersError = action.payload as string;
            })

            // REMOVE MEMBER
            .addCase(removeMemberFromGym.pending, (state) => {
                state.membersLoading = true;
                state.membersError = null;
            })
            .addCase(removeMemberFromGym.fulfilled, (state, action) => {
                state.membersLoading = false;
                state.members = state.members.filter(
                    (member) => member.publicId !== action.payload.publicId
                );
            })
            .addCase(removeMemberFromGym.rejected, (state, action) => {
                state.membersLoading = false;
                state.membersError = action.payload as string;
            })

            // REMOVE TRAINER
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
                state.trainersError = action.payload as string;
            })

            // MEMBER DETAIL
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
                state.memberDetailError = action.payload as string;
            })

            // TRAINER DETAIL
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
                state.trainerDetailError = action.payload as string;
            });
    },
});

export const { clearGymError, clearMemberDetail, clearTrainerDetail } = gymSlice.actions;
export default gymSlice.reducer;