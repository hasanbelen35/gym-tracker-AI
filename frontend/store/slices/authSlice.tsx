import { createSlice, createAsyncThunk, PayloadAction, UnknownAction } from '@reduxjs/toolkit';
import { Gym, Member, Trainer } from '@/types/types';
import { AuthState } from '@/types/auth.types'
import { AxiosError } from "axios";
import { API } from "@/lib/api";

interface ApiErrorResponse {
    message?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterGymData {
    name: string;
    email: string;
    password: string;
    address?: string;
    phone?: string;
}

interface RegisterMemberData {
    name: string;
    surname: string;
    email: string;
    password: string;
    gymId: number;
}

interface RegisterTrainerData {
    name: string;
    surname: string;
    email: string;
    password: string;
    gymId: number;
}

const initialState: AuthState = {
    user: null,
    role: null,
    loading: false,
    error: null,
};

export const registerGym = createAsyncThunk('auth/registerGym', async (data: RegisterGymData, { rejectWithValue }) => {
    try {
        const response = await API.post('/auth/gym/register', data);
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ApiErrorResponse>;
        return rejectWithValue(err.response?.data?.message || "Salon kaydı yapılamadı.");
    }
});

export const loginGym = createAsyncThunk('auth/loginGym', async (data: LoginCredentials, { rejectWithValue }) => {
    try {
        const response = await API.post('/auth/gym/login', data);
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ApiErrorResponse>;
        return rejectWithValue(err.response?.data?.message || "Giriş yapılamadı.");
    }
});

export const registerMember = createAsyncThunk('auth/registerMember', async (data: RegisterMemberData, { rejectWithValue }) => {
    try {
        const response = await API.post('/auth/member/register', data);
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ApiErrorResponse>;
        return rejectWithValue(err.response?.data?.message || "Üye kaydı sırasında hata oluştu.");
    }
});

export const loginMember = createAsyncThunk('auth/loginMember', async (data: LoginCredentials, { rejectWithValue }) => {
    try {
        const response = await API.post('/auth/member/login', data);
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ApiErrorResponse>;
        return rejectWithValue(err.response?.data?.message || "Üye girişi yapılamadı.");
    }
});

export const registerTrainer = createAsyncThunk('auth/registerTrainer', async (data: RegisterTrainerData, { rejectWithValue }) => {
    try {
        const response = await API.post('/auth/trainer/register', data);
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ApiErrorResponse>;
        return rejectWithValue(err.response?.data?.message || "Eğitmen kaydı yapılamadı.");
    }
});

export const loginTrainer = createAsyncThunk('auth/loginTrainer', async (data: LoginCredentials, { rejectWithValue }) => {
    try {
        const response = await API.post('/auth/trainer/login', data);
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ApiErrorResponse>;
        return rejectWithValue(err.response?.data?.message || "Eğitmen girişi yapılamadı.");
    }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await API.post('/auth/logout');
    } catch (error) {
        const err = error as AxiosError<ApiErrorResponse>;
        return rejectWithValue(err.response?.data?.message || "Çıkış yapılamadı.");
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => { state.error = null; },
        logout: (state) => {
            state.user = null;
            state.role = null;
            state.loading = false;
        }
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
            .addCase(loginTrainer.fulfilled, (state, action: PayloadAction<{ trainer: Trainer }>) => {
                state.loading = false;
                state.user = action.payload.trainer;
                state.role = 'trainer';
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.role = null;
                state.loading = false;
            })
            .addCase(logoutUser.rejected, (state) => {
                state.user = null;
                state.role = null;
                state.loading = false;
            })
            .addMatcher((action) => action.type.endsWith('/pending'), (state) => {
                state.loading = true;
                state.error = null;
            })
            .addMatcher((action) => action.type.endsWith('/rejected'), (state, action: UnknownAction) => {
                state.loading = false;
                state.error = (action as { payload?: string }).payload || 'Beklenmedik bir hata oluştu.';
            })
            .addMatcher((action) => action.type.endsWith('/fulfilled'), (state) => {
                state.loading = false;
            });
    },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;