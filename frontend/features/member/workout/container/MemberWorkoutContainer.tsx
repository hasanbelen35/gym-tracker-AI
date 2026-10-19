"use client";
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { 
    fetchActiveSession, 
    startWorkoutSession, 
    finishWorkoutSession, 
    updateLocalSetLog,
    SetLog 
} from '@/store/slices/member.workoutLog.slice';
import { StartWorkoutCard } from '../components/StartWorkoutCard';
import { ActiveWorkoutView } from '../components/ActiveWorkoutView';

export default function MemberWorkoutContainer() {
    const dispatch = useAppDispatch();
    const { activeSession, loading, actionLoading } = useAppSelector((state) => state.workoutLog);

    useEffect(() => {
        dispatch(fetchActiveSession());
    }, [dispatch]);

    const handleStart = () => {
        dispatch(startWorkoutSession());
    };

    const handleUpdateSet = (
        exerciseLogId: number, 
        setNumber: number, 
        status: SetLog['status'], 
        actualReps?: number, 
        actualWeight?: number, 
        actualRir?: number
    ) => {
        dispatch(
            updateLocalSetLog({
                exerciseLogId,
                setNumber,
                status,
                actualReps,
                actualWeight,
                actualRir,
            })
        );
    };

    const handleFinish = () => {
        dispatch(finishWorkoutSession({}));
    };

    if (loading) {
        return <div className="p-8 text-center text-foreground/60 font-medium">Antrenman verileri yükleniyor...</div>;
    }

    return (
        <div className="w-full">
            {activeSession ? (
                <ActiveWorkoutView
                    session={activeSession}
                    onUpdateSet={handleUpdateSet}
                    onFinishSession={handleFinish}
                    actionLoading={actionLoading}
                />
            ) : (
                <StartWorkoutCard onStart={handleStart} loading={actionLoading} />
            )}
        </div>
    );
}