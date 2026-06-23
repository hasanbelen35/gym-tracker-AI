import { createSlice, createAsyncThunk, PayloadAction, AnyAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Gym {
    id: number;
    name: string;
    email: string;
}

interface Member {
    id: number;
    name: string;
    surname: string;
    email: string;
}

interface AuthState {
    user: Gym | Member | null;
    role: 'gym' | 'member' | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    role: null,
    loading: false,
    error: null,
};

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_API_URL || "http://localhost:5000/api",
    withCredentials: true,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registerGym = createAsyncThunk('auth/registerGym', async (data: Record<string, any>, { rejectWithValue }) => {
    try {
        const response = await API.post('/auth/gym/register', data);
        return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Kayıt sırasında bir hata oluştu.");
    }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const loginGym = createAsyncThunk('auth/loginGym', async (data: Record<string, any>, { rejectWithValue }) => {
    try {
        const response = await API.post('/auth/gym/login', data);
        return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Giriş yapılamadı.");
    }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registerMember = createAsyncThunk('auth/registerMember', async (data: Record<string, any>, { rejectWithValue }) => {
    try {
        const response = await API.post('/auth/member/register', data);
        return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Üye kaydı sırasında hata oluştu.");
    }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const loginMember = createAsyncThunk('auth/loginMember', async (data: Record<string, any>, { rejectWithValue }) => {
    try {
        const response = await API.post('/auth/member/login', data);
        return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Üye girişi yapılamadı.");
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => { state.error = null; },
        logout: (state) => { state.user = null; state.role = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerGym.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(loginGym.fulfilled, (state, action: PayloadAction<{ gym: Gym }>) => {
                state.loading = false;
                state.user = action.payload.gym;
                state.role = 'gym';
            })
            .addCase(loginMember.fulfilled, (state, action: PayloadAction<{ member: Member }>) => {
                state.loading = false;
                state.user = action.payload.member;
                state.role = 'member';
            })
            .addMatcher((action) => action.type.endsWith('/pending'), (state) => {
                state.loading = true;
                state.error = null;
            })
            .addMatcher((action) => action.type.endsWith('/rejected'), (state, action: AnyAction) => {
                state.loading = false;
                state.error = action.payload as string || 'Beklenmedik bir hata oluştu.';
            });
    },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;