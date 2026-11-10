"use client";

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { 
    fetchActiveSession, 
    checkDayCompletedToday,
    startWorkoutSession, 
    finishWorkoutSession, 
    updateLocalSetLog,
    clearWorkoutError,
    SetLog 
} from '@/store/slices/member.workoutLog.slice';
import { StartWorkoutCard } from '../components/StartWorkoutCard';
import { ActiveWorkoutView } from '../components/ActiveWorkoutView';

export default function MemberWorkoutContainer() {
    const dispatch = useAppDispatch();
    const { activeSession, isCompletedToday, loading, actionLoading, error } = useAppSelector((state) => state.workoutLog);

    useEffect(() => {
        dispatch(fetchActiveSession());
        dispatch(checkDayCompletedToday()); // Sayfa yüklenince bugünün tamamlanma durumunu çek
    }, [dispatch]);

    const handleStart = (workoutDayId?: number) => {
        dispatch(clearWorkoutError());
        dispatch(startWorkoutSession({ workoutDayId }));
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

const handleFinish = (memberNote?: string) => {
    dispatch(clearWorkoutError());
    dispatch(finishWorkoutSession({ memberNote }))
        .unwrap()
        .catch(() => {
                dispatch(fetchActiveSession());
        });
};

    if (loading) {
        return <div className="p-8 text-center text-foreground/60 font-medium">Antrenman verileri yükleniyor...</div>;
    }

    if (activeSession) {
        return (
            <ActiveWorkoutView
                session={activeSession}
                onUpdateSet={handleUpdateSet}
                onFinishSession={handleFinish}
                actionLoading={actionLoading}
                errorMessage={error}
            />
        );
    }

    if (isCompletedToday) {
        return (
            <div className="relative overflow-hidden bg-nav-bg border border-emerald-500/30 rounded-3xl p-8 md:p-12 text-center space-y-6 shadow-xl ui-fade-in">
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-500 text-4xl shadow-inner">
                    ✅
                </div>

                <div className="relative max-w-lg mx-auto space-y-3">
                    <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-wider">
                        Bugünün Antrenmanı Tamamlandı
                    </span>

                    <h3 className="text-3xl font-black text-foreground tracking-tight">
                        Tebrikler, Harika Bir Gün Geçirdin! 🎉
                    </h3>

                    <p className="text-sm text-foreground/60 leading-relaxed">
                        Bugüne ait antrenman programını ve tüm setlerini başarıyla kaydettin. Kaslarının gelişimi için dinlenebilir ve beslenmene dikkat edebilirsin.
                    </p>
                </div>

                <div className="pt-2 flex justify-center gap-3">
                    <span className="text-xs font-semibold text-foreground/50 bg-background px-4 py-2 rounded-xl border border-nav-border">
                        Gece 00:00 sonrası yeni antrenman günü aktifleşecektir.
                    </span>
                </div>
            </div>
        );
    }

    return (
        <StartWorkoutCard 
            onStart={handleStart} 
            loading={actionLoading} 
            error={error}
        />
    );
}