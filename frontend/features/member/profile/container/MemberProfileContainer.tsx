'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
    fetchCurrentMember,
    fetchMyTrainer,
    fetchMemberMeasurements,
    fetchMemberSessions,
    fetchMemberPrograms,
} from "@/store/slices/memberSlice";
import { ArrowLeftIcon } from '@/icons/icon';

import { MemberProfileHeader } from "@/features/member/profile/components/MemberProfileHeader";
import { MemberProfileStatsGrid } from "@/features/member/profile/components/MemberProfileStatsGrid";
import { MemberProfileGoalsGrid } from "@/features/member/profile/components/MemberProfileGoalsGrid";
import { MemberProfileMedicalNotes } from "@/features/member/profile/components/MemberProfileMedicalNotes";
import { MemberTrainerCard } from "@/features/member/profile/components/MemberTrainerCard";
import { MemberMeasurementsCard } from "@/features/member/profile/components/MemberMeasurementsCard";
import { MemberProgramsCard } from "@/features/member/profile/components/MemberProgramsCard";
import { MemberSessionsCard } from "@/features/member/profile/components/MemberSessionsCard";

import Loading from "@/components/Loading";
import { ErrorBox } from "@/components/ui/ErrorBox";
import { SuccessBox } from "@/components/ui/SuccessBox";

export default function MemberProfileContainer() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const {
        profile,
        trainer,
        assignmentStatus,
        programs,
        pagination: programsPagination,
        sessions,
        sessionsPagination,
        measurements,
        measurementsPagination,
        loading,
        error,
    } = useAppSelector((state) => state.member);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchCurrentMember())
            .unwrap()
            .then(() => {
                setSuccessMessage("Profil bilgileriniz başarıyla yüklendi.");
            })
            .catch(() => {
                setSuccessMessage(null);
            });

        dispatch(fetchMyTrainer());
        dispatch(fetchMemberMeasurements({ page: 1, limit: 10 }));
        dispatch(fetchMemberSessions({ page: 1, limit: 10 }));
        dispatch(fetchMemberPrograms({ page: 1, limit: 10 }));
    }, [dispatch]);

    const handleMeasurementPageChange = (newPage: number) => {
        dispatch(fetchMemberMeasurements({ page: newPage, limit: 10 }));
    };

    const handleSessionPageChange = (newPage: number) => {
        dispatch(fetchMemberSessions({ page: newPage, limit: 10 }));
    };

    const handleProgramPageChange = (newPage: number) => {
        dispatch(fetchMemberPrograms({ page: newPage, limit: 10 }));
    };

    if (error && !profile) {
        return (
            <div className="min-h-screen w-full bg-background text-foreground p-6 sm:p-10 flex items-center justify-center">
                <div className="max-w-md w-full space-y-4">
                    <ErrorBox message={error} />
                    <button
                        onClick={() => router.back()}
                        className="w-full px-4 py-2.5 rounded-xl bg-nav-bg border border-nav-border text-foreground text-xs font-semibold hover:bg-foreground/5 transition-all cursor-pointer shadow-sm"
                    >
                        Geri Dön
                    </button>
                </div>
            </div>
        );
    }

    if (!profile) {
        return loading ? <Loading /> : null;
    }

    const getStatusBadge = (status?: string | null) => {
        switch (status) {
            case 'ASSIGNED':
                return <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">Antrenör Atandı</span>;
            case 'PENDING':
                return <span className="text-xs px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold">Onay Bekliyor</span>;
            default:
                return <span className="text-xs px-3 py-1 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20 font-bold">{status || 'Antrenör Yok'}</span>;
        }
    };

    const getGenderLabel = (gender?: string | null) => {
        switch (gender) {
            case 'MALE': return 'Erkek';
            case 'FEMALE': return 'Kadın';
            default: return gender || '-';
        }
    };

    return (
        <div className="min-h-screen w-full bg-background text-foreground p-6 sm:p-10 transition-colors duration-200">
            <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">

                <ErrorBox message={error} />
                <SuccessBox message={successMessage} />

                {/* TOP BAR */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-nav-bg border border-nav-border text-sm font-medium text-foreground/80 hover:border-brand-500 hover:text-brand-500 transition-all shadow-sm cursor-pointer"
                    >
                        <ArrowLeftIcon /> Geri Dön
                    </button>

                    <div className="flex items-center gap-3">
                        {getStatusBadge(assignmentStatus)}
                    </div>
                </div>

                {/* PROFILE */}
                <div className="bg-nav-bg border border-nav-border rounded-2xl p-6 sm:p-8 shadow-nav backdrop-blur-md space-y-6">
                    <MemberProfileHeader member={profile} getStatusBadge={getStatusBadge} />
                    <MemberProfileStatsGrid member={profile} getGenderLabel={getGenderLabel} />
                    <MemberProfileGoalsGrid member={profile.profile ?? {}} />
                    <MemberProfileMedicalNotes medicalNotes={profile.medicalNotes} />
                </div>

                {/* TRAINER */}
                <MemberTrainerCard trainer={trainer} assignmentStatus={assignmentStatus} />

                {/* MEASUREMENTS */}
                <MemberMeasurementsCard
                    measurements={measurements}
                    pagination={measurementsPagination}
                    loading={loading}
                    onPageChange={handleMeasurementPageChange}
                />

                {/* PROGRAMS AND SESSIONS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MemberProgramsCard
                        programs={programs}
                        pagination={programsPagination}
                        loading={loading}
                        onPageChange={handleProgramPageChange}
                        onProgramClick={(publicId) => router.push(`/member/programs/${publicId}`)}
                    />

                    <MemberSessionsCard
                        sessions={sessions}
                        pagination={sessionsPagination}
                        loading={loading}
                        onPageChange={handleSessionPageChange}
                    />
                </div>

            </div>
        </div>
    );
}