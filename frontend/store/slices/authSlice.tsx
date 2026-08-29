import { createSlice, createAsyncThunk, PayloadAction, AnyAction } from '@reduxjs/toolkit';
import { Gym, Member, AuthState } from '@/types/types';
import { AxiosError } from "axios";
import { API } from "@/lib/api";

interface ApiErrorResponse {
    message?: string;
}

const initialState: AuthState = {
    user: null,
    role: null,
    loading: false,
    error: null,
};


// ------------------------------------------------------------------------REGISTER ------------------------------------------------------------------------

export const registerGym = createAsyncThunk('auth/registerGym', async (data: Record<string, unknown>, { rejectWithValue }) => {
    try {
        const response = await API.post('/auth/gym/register', data);
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ApiErrorResponse>;
        return rejectWithValue(err.response?.data?.message || "Eğitmen bilgisi alınamadı.");
    }
});

export const loginGym = createAsyncThunk('auth/loginGym', async (data: Record<string, unknown>, { rejectWithValue }) => {
    try {
        const response = await API.post('/auth/gym/login', data);
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ApiErrorResponse>;
        return rejectWithValue(err.response?.data?.message || "Giriş yapılamadı.");
    }
});

// ------------------------------------------------------------------------MEMBER ------------------------------------------------------------------------

export const registerMember = createAsyncThunk('auth/registerMember', async (data: Record<string, unknown>, { rejectWithValue }) => {
    try {
        const response = await API.post('/auth/member/register', data);
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ApiErrorResponse>;
        return rejectWithValue(err.response?.data?.message || "Üye kaydı sırasında hata oluştu.");
    }
});

export const loginMember = createAsyncThunk('auth/loginMember', async (data: Record<string, unknown>, { rejectWithValue }) => {
    try {
        const response = await API.post('/auth/member/login', data);
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ApiErrorResponse>;
        return rejectWithValue(err.response?.data?.message || "Üye girişi yapılamadı.");
    }
});

// ------------------------------------------------------------------------TRAINER ------------------------------------------------------------------------

export const registerTrainer = createAsyncThunk('auth/registerTrainer', async (data: Record<string, unknown>, { rejectWithValue }) => {
    try {
        const response = await API.post('/auth/trainer/register', data);
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ApiErrorResponse>;
        return rejectWithValue(err.response?.data?.message || "Eğitmen kaydı yapılamadı.");
    }
});

export const loginTrainer = createAsyncThunk('auth/loginTrainer', async (data: Record<string, unknown>, { rejectWithValue }) => {
    try {
        const response = await API.post('/auth/trainer/login', data);
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ApiErrorResponse>;
        return rejectWithValue(err.response?.data?.message || "Eğitmen girişi yapılamadı.");
    }
});

// LOGOUT USER 
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
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.role = null;
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
            })
            .addMatcher((action) => action.type.endsWith('/fulfilled'), (state) => {
                state.loading = false;
            });
    },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;