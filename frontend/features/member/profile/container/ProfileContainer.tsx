'use client';

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchCurrentMember, fetchMyTrainer } from "@/store/slices/memberSlice";
import Loading from "@/components/Loading";
import { ErrorBox } from "@/components/ui/ErrorBox";
import { SuccessBox } from "@/components/ui/SuccessBox"; // Dosya yolunu kendi projene göre ayarla
import { ProfileHeader } from "@/features/member/profile/components/ProfileHeader";
import { PhysicalStatsCard } from "@/features/member/profile/components/PhysicalStatsCard";
import { TrainerAndSessionsCard } from "@/features/member/profile/components/TrainerAndSessionsCard";

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    
    const { 
        profile, 
        trainer, 
        assignmentStatus, 
        loading, 
        error, 
        successMessage 
    } = useAppSelector((state) => state.member);

    useEffect(() => {
        dispatch(fetchCurrentMember());
        dispatch(fetchMyTrainer());
    }, [dispatch]);

    if (loading && !profile) {
        return <Loading />;
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
            
            {(error || successMessage) && (
                <div className="flex flex-col gap-3">
                    {error && <ErrorBox message={error} />}
                    {successMessage && <SuccessBox message={successMessage} />}
                </div>
            )}

            <ProfileHeader profile={profile} assignmentStatus={assignmentStatus} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PhysicalStatsCard profile={profile} />
                <TrainerAndSessionsCard trainer={trainer} sessions={profile?.sessions || []} />
            </div>
        </div>
    );
};

export default ProfilePage;