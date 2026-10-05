// src/store/slices/riskSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { API } from "@/lib/api";
import { RiskAnalyticsData, RiskState } from "@/types/risk.types"


interface ApiErrorResponse {
    message?: string;
}

const initialState: RiskState = {
    analytics: null,
    loading: false,
    error: null,
};

// GET GYM MEMBER RISK ANALYTICS (refresh = true IGNORES CACHE)
export const fetchRiskAnalytics = createAsyncThunk(
    'risk/fetchRiskAnalytics',
    async (refresh: boolean | undefined, { rejectWithValue }) => {
        try {
            const response = await API.get('/gym/risk-analytics', {
                params: refresh ? { refresh: true } : undefined,
            });
            return (response.data.data ?? response.data) as RiskAnalyticsData;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(err.response?.data?.message || "Risk analizi alınamadı.");
        }
    }
);

const riskSlice = createSlice({
    name: 'risk',
    initialState,
    reducers: {
        clearRiskError: (state) => { state.error = null; },
        clearRiskAnalytics: (state) => { state.analytics = null; state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRiskAnalytics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRiskAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.analytics = action.payload;
            })
            .addCase(fetchRiskAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearRiskError, clearRiskAnalytics } = riskSlice.actions;
export default riskSlice.reducer;