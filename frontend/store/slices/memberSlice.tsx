import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { MemberState } from "@/types/types";


const initialState: MemberState = {
    trainer: null,
    assignmentStatus: null,
    loading: false,
    error: null,
};

export const fetchMyTrainer = createAsyncThunk(
    "member/fetchMyTrainer",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("http://localhost:5000/api/member/getMyTrainerData", {
                withCredentials: true,
            });
            console.log(response.data.data)
            return response.data.data; // { trainer, assignmentStatus } döner
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            return rejectWithValue(err.response?.data?.message || "Eğitmen bilgisi alınamadı.");
        }
    }
);

const memberSlice = createSlice({
    name: "member",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyTrainer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyTrainer.fulfilled, (state, action) => {
                state.loading = false;
                state.trainer = action.payload.trainer;
                state.assignmentStatus = action.payload.assignmentStatus;
            })
            .addCase(fetchMyTrainer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default memberSlice.reducer;