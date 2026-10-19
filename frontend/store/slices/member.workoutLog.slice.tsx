import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

interface ApiErrorResponse {
    message?: string;
}

export interface SetLog {
    id: number;
    publicId: string;
    exerciseLogId: number;
    workoutSetId: number | null;
    setNumber: number;
    targetReps: string | null;
    targetWeight: number | null;
    targetRir: number | null;
    actualReps: number | null;
    actualWeight: number | null;
    actualRir: number | null;
    status: "MATCHED" | "MODIFIED" | "SKIPPED";
}

export interface ExerciseLog {
    id: number;
    publicId: string;
    workoutLogId: number;
    exerciseName: string;
    orderIndex: number;
    notes: string | null;
    setLogs: SetLog[];
}
export interface WorkoutSession {
    id: number;
    publicId: string;
    memberId: number;
    workoutDayId: number | null;
    startedAt: string;
    completedAt: string | null;
    durationMinutes: number | null;
    status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    memberNote: string | null;
    aiFeedback: string | null;
    workoutDay?: {
        id: number;
        publicId: string;
        programId: number;
        dayName: string;
        dayOrder: number;
        isRestDay: boolean;
        program?: {
            id: number;
            publicId: string;
            title: string;
            type: string;
            splitType: string;
            isActive: boolean;
        };
    };
    exerciseLogs: ExerciseLog[];
}

interface WorkoutLogState {
    activeSession: WorkoutSession | null;
    loading: boolean;
    actionLoading: boolean;
    error: string | null;
}

const initialState: WorkoutLogState = {
    activeSession: null,
    loading: false,
    actionLoading: false,
    error: null,
};

export const fetchActiveSession = createAsyncThunk(
    "workoutLog/fetchActiveSession",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/member/workoutLog/active", {
                withCredentials: true,
            });
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(err.response?.data?.message || "Aktif oturum getirilemedi.");
        }
    }
);

export const startWorkoutSession = createAsyncThunk(
    "workoutLog/startWorkoutSession",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "/api/member/workoutLog/start",
                {},
                { withCredentials: true }
            );
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(err.response?.data?.message || "Antrenman başlatılamadı.");
        }
    }
);

export const logSingleSet = createAsyncThunk(
    "workoutLog/logSingleSet",
    async (
        data: {
            workoutLogId: number;
            exerciseLogId: number;
            setNumber: number;
            actualReps?: number;
            actualWeight?: number;
            actualRir?: number;
            status: "MATCHED" | "MODIFIED" | "SKIPPED";
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                "/api/member/workoutLog/set",
                data,
                { withCredentials: true }
            );
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(err.response?.data?.message || "Set loglanamadı.");
        }
    }
);

export const finishWorkoutSession = createAsyncThunk(
    "workoutLog/finishWorkoutSession",
    async (
        data: { workoutLogId: number; memberNote?: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                "/api/member/workoutLog/finish",
                data,
                { withCredentials: true }
            );
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            return rejectWithValue(err.response?.data?.message || "Antrenman tamamlanamadı.");
        }
    }
);

const workoutLogSlice = createSlice({
    name: "workoutLog",
    initialState,
    reducers: {
        clearWorkoutError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchActiveSession.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActiveSession.fulfilled, (state, action: PayloadAction<WorkoutSession | null>) => {
                state.loading = false;
                state.activeSession = action.payload;
            })
            .addCase(fetchActiveSession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(startWorkoutSession.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(startWorkoutSession.fulfilled, (state, action: PayloadAction<WorkoutSession>) => {
                state.actionLoading = false;
                state.activeSession = action.payload;
            })
            .addCase(startWorkoutSession.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload as string;
            })

            .addCase(logSingleSet.fulfilled, (state, action: PayloadAction<SetLog>) => {
                if (state.activeSession) {
                    const updatedSet = action.payload;
                    const exerciseLog = state.activeSession.exerciseLogs.find(
                        (ex) => ex.id === updatedSet.exerciseLogId
                    );
                    if (exerciseLog) {
                        const setLogIndex = exerciseLog.setLogs.findIndex(
                            (s) => s.setNumber === updatedSet.setNumber
                        );
                        if (setLogIndex !== -1) {
                            exerciseLog.setLogs[setLogIndex] = updatedSet;
                        } else {
                            exerciseLog.setLogs.push(updatedSet);
                        }
                    }
                }
            })

            .addCase(finishWorkoutSession.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(finishWorkoutSession.fulfilled, (state) => {
                state.actionLoading = false;
                state.activeSession = null;
            })
            .addCase(finishWorkoutSession.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearWorkoutError } = workoutLogSlice.actions;
export default workoutLogSlice.reducer;