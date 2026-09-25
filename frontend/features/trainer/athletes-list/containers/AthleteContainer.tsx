"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchMembersByStatus } from "@/store/slices/trainerSlice";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/Loading";
import { AthleteSection } from "@/features/trainer/athletes-list/components/AthleteSection";

export const AthletesContainer: React.FC = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { user, loading: authLoading } = useAuth();
    const { pendingMembers, approvedMembers, loading, error } = useAppSelector(
        (state) => state.trainer
    );

    const gymId = user?.gymPublicId;

    useEffect(() => {
        if (gymId) {
            dispatch(fetchMembersByStatus({ gymId, status: 'PENDING' }));
            dispatch(fetchMembersByStatus({ gymId, status: 'ASSIGNED' }));
        }
    }, [dispatch, gymId]);

    const handleMemberClick = (publicId: string) => {
        router.push(`/trainer/athletes/${publicId}`);
    };

    if (authLoading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen w-full bg-background text-foreground p-6 sm:p-10 transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <button
                        onClick={() => router.back()}
                        className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-nav-bg border border-nav-border text-sm font-medium hover:border-brand-500 hover:text-brand-500 transition-all shadow-sm cursor-pointer"
                    >
                        <span className="transition-transform group-hover:-translate-x-1">&larr;</span> Geri Dön
                    </button>
                </div>

                <header className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Antrenör Paneli</h1>
                    <p className="text-sm opacity-70 mt-1">Bekleyen taleplerinizi ve onaylı sporcularınızı yönetin.</p>
                </header>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-brand-50 border border-brand-600/40 text-brand-text text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <AthleteSection
                        title="Bekleyen Talepler"
                        icon="⏳"
                        members={pendingMembers}
                        loading={loading}
                        type="pending"
                        emptyText="Bekleyen sporcu talebi bulunmuyor."
                    />

                    <AthleteSection
                        title="Sporcularım"
                        icon="💪"
                        members={approvedMembers}
                        loading={loading}
                        type="approved"
                        emptyText="Henüz atanmış sporcunuz bulunmuyor."
                        onMemberClick={handleMemberClick}
                    />
                </div>
            </div>
        </div>
    );
};