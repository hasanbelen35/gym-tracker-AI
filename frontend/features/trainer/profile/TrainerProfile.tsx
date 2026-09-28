'use client';

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchTrainerProfile, updateTrainerProfile } from "@/store/slices/trainerSlice";
import { TrainerProfileUI } from "@/features/trainer/profile/TrainerProfileUI";
import { UpdateTrainerProfileData } from "@/features/trainer/profile/types";

const TrainerProfileContainer = () => {
    const dispatch = useAppDispatch();
    
    const { trainerProfile, loading, error } = useAppSelector((state) => state.trainer);

    useEffect(() => {
        dispatch(fetchTrainerProfile());
    }, [dispatch]);

    const handleUpdate = async (data: UpdateTrainerProfileData) => {
        await dispatch(updateTrainerProfile(data)).unwrap();
    };

    return (
        <TrainerProfileUI
            trainerProfile={trainerProfile}
            loading={loading}
            error={error}
            onUpdate={handleUpdate}
        />
    );
};

export default TrainerProfileContainer;