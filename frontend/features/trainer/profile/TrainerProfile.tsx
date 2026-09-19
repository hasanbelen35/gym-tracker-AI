// features/trainer/profile/TrainerProfile.tsx
'use client';

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchTrainerProfile } from "@/store/slices/trainerSlice"; 
import { TrainerProfileUI } from "@/components/trainer/TrainerProfileUI";

const TrainerProfileContainer = () => {
    const dispatch = useAppDispatch();
    
    const { trainerProfile, loading, error } = useAppSelector((state) => state.trainer);

    useEffect(() => {
        dispatch(fetchTrainerProfile());
    }, [dispatch]);

    return (
        <TrainerProfileUI
            trainerProfile={trainerProfile}
            loading={loading}
            error={error}
        />
    );
};

export default TrainerProfileContainer;