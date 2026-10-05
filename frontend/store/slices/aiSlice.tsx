import { createSlice, createAsyncThunk, PayloadAction, UnknownAction } from '@reduxjs/toolkit';
import { AxiosError } from "axios";
import { API } from "@/lib/api";

interface ApiErrorResponse {
    message?: string;
}

interface AIState {
    analysisResult: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AIState = {
    analysisResult: null,
    loading: false,
    error: null,
};

export const fetchMemberAIAnalysis = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>(
    'ai/fetchMemberAIAnalysis',
    async (memberPublicId, { rejectWithValue }) => {
        try {
            const response = await API.get(`/trainer/ai/my-members/analyze/${memberPublicId}`);
            console.log(response.data.data);
            return response.data.data || response.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(err.response?.data?.message || "AI analizi alınamadı.");
        }
    }
);

const aiSlice = createSlice({
    name: 'ai',
    initialState,
    reducers: {
        clearAIError: (state) => {
            state.error = null;
        },
        clearAIAnalysis: (state) => {
            state.analysisResult = null;
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMemberAIAnalysis.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.analysisResult = action.payload;
                state.error = null;
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

export const { clearAIError, clearAIAnalysis } = aiSlice.actions;
export default aiSlice.reducer;