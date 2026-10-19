
import {
    createSlice,
    createAsyncThunk,
    PayloadAction,
} from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { API } from "@/lib/api";
import { Exercise } from "@/types/types";

interface ApiErrorResponse {
    message?: string;
}

export type SetStatus =
    | "PENDING"
    | "MATCHED"
    | "MODIFIED"
    | "SKIPPED";

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
    status: SetStatus;
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
        exercises?: Exercise[];
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

/**
 * Yeni başlayan aktif oturumdaki setleri bekliyor durumuna getirir.
 * Henüz kullanıcı tarafından girilmemiş gerçekleşen değerleri temizler.
 */
const prepareNewSession = (
    session: WorkoutSession
): WorkoutSession => ({
    ...session,
    exerciseLogs: session.exerciseLogs.map((exerciseLog) => ({
        ...exerciseLog,
        setLogs: exerciseLog.setLogs.map((set) => ({
            ...set,
            status: "PENDING",
            actualReps: null,
            actualWeight: null,
            actualRir: null,
        })),
    })),
});

export const fetchActiveSession = createAsyncThunk<
    WorkoutSession | null,
    void,
    { rejectValue: string }
>(
    "workoutLog/fetchActiveSession",
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get(
                "/member/workoutLog/active",
                { withCredentials: true }
            );

            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;

            return rejectWithValue(
                err.response?.data?.message ||
                    "Aktif oturum getirilemedi."
            );
        }
    }
);

export const startWorkoutSession = createAsyncThunk<
    WorkoutSession,
    void,
    { rejectValue: string }
>(
    "workoutLog/startWorkoutSession",
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.post(
                "/member/workoutLog/start",
                {},
                { withCredentials: true }
            );

            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;

            return rejectWithValue(
                err.response?.data?.message ||
                    "Antrenman başlatılamadı."
            );
        }
    }
);

export const finishWorkoutSession = createAsyncThunk<
    unknown,
    { memberNote?: string },
    {
        state: { workoutLog: WorkoutLogState };
        rejectValue: string;
    }
>(
    "workoutLog/finishWorkoutSession",
    async (data, { getState, rejectWithValue }) => {
        try {
            const activeSession =
                getState().workoutLog.activeSession;

            if (!activeSession) {
                return rejectWithValue(
                    "Aktif oturum bulunamadı."
                );
            }

            const payload = {
                workoutLogId: activeSession.id,
                memberNote: data.memberNote,
                exerciseLogs: activeSession.exerciseLogs.map(
                    (exerciseLog) => ({
                        exerciseLogId: exerciseLog.id,
                        setLogs: exerciseLog.setLogs
                            // Bekleyen setleri tamamlanmış gibi göndermiyoruz.
                            .filter((set) => set.status !== "PENDING")
                            .map((set) => ({
                                setNumber: set.setNumber,
                                actualReps: set.actualReps,
                                actualWeight: set.actualWeight,
                                actualRir: set.actualRir,
                                status: set.status,
                            })),
                    })
                ),
            };

            const response = await API.post(
                "/member/workoutLog/finish",
                payload,
                { withCredentials: true }
            );

            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;

            return rejectWithValue(
                err.response?.data?.message ||
                    "Antrenman tamamlanamadı."
            );
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

        updateLocalSetLog: (
            state,
            action: PayloadAction<{
                exerciseLogId: number;
                setNumber: number;
                actualReps?: number;
                actualWeight?: number;
                actualRir?: number;
                status: SetStatus;
            }>
        ) => {
            if (!state.activeSession) return;

            const {
                exerciseLogId,
                setNumber,
                actualReps,
                actualWeight,
                actualRir,
                status,
            } = action.payload;

            const exerciseLog =
                state.activeSession.exerciseLogs.find(
                    (exercise) => exercise.id === exerciseLogId
                );

            if (!exerciseLog) return;

            const setLog = exerciseLog.setLogs.find(
                (set) => set.setNumber === setNumber
            );

            if (!setLog) return;

            setLog.status = status;

            if (actualReps !== undefined) {
                setLog.actualReps = actualReps;
            }

            if (actualWeight !== undefined) {
                setLog.actualWeight = actualWeight;
            }

            if (actualRir !== undefined) {
                setLog.actualRir = actualRir;
            }
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchActiveSession.pending, (state) => {   
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActiveSession.fulfilled, (state, action) => {
                state.loading = false;

                const session = action.payload;

                state.activeSession = session
                    ? prepareNewSession(session)
                    : null;
            })
            .addCase(fetchActiveSession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(startWorkoutSession.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(startWorkoutSession.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.activeSession = prepareNewSession(action.payload);
            })
            .addCase(startWorkoutSession.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload as string;
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

export const {
    clearWorkoutError,
    updateLocalSetLog,
} = workoutLogSlice.actions;

export default workoutLogSlice.reducer;
